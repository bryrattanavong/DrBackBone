const sqlite3 = require('sqlite3');

const {genRandomString} = require('./utils');
const {
    getMedicalConditionsDb
} = require('./db');

function getAllMedicalConditions(request, response) {
    let returnObj = {};
    let dateFilter = request.query.date ? `AND date LIKE "%${request.query.date}%"`: "";

    let userID = request.body.userId;
    let listOfMedicalConditions = [];
    let database = getMedicalConditionsDb();
    const sql = `SELECT name, date, uniqueId FROM medical_conditions WHERE userId LIKE "%${userID}%" ${dateFilter} ORDER BY date;`;
    database.all(sql, [], (err, row) => {
        row.forEach((element) => {
            listOfMedicalConditions.push({
                name: element.name,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfMedicalConditions;
        response.json(returnObj);
        response.end();
    });
}

function editMedicalCondition(request, response) {
    var returnObj = {};
    let database = getMedicalConditionsDb();
    let {
        name,
        notes,
        userId,
        date,
        uniqueId
    } = request.body;

    var sqlUpdate = `UPDATE medication_conditions SET name = ${name}, notes = ${notes}, userId = ${userId}, date = ${date} WHERE uniqueId LIKE "%${uniqueId}%";`;
    database.run(sqlUpdate, [], function (err) {
        if (err) {
            returnObj.error = true;
            return console.error(err.message);
        } else {
            returnObj.error = false;
        }
        response.json(returnObj);
        response.end();
    });
}

function getMedicalConditionInfo(request, response) {
    let returnObj = {};

    let uniqueId = request.body.uniqueId;
    let listOfMedicalConditions = [];
    let database = getMedicalConditionsDb();
    const sql = `SELECT * FROM medical_conditions WHERE uniqueId LIKE "%${uniqueId}%"`;
    database.all(sql, [], (err, row) => {
        row.forEach((element) => {
            listOfMedicalConditions.push({
                name: element.name,
                notes: element.notes,
                userId: element.userId,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfMedicalConditions;
        response.json(returnObj);
        response.end();
    });
}

function addMedicalCondition(request, response) {
    let returnObj = {};
    let database = getMedicalConditionsDb();
    const uniqueId = genRandomString(16);
    let {
        name,
        notes,
        userId,
        date
    } = request.body;

    try {
        var sqlInsert = database.prepare('INSERT INTO medical_conditions (name, notes, userId, date, uniqueId) VALUES (?,?,?,?,?);');
        sqlInsert.run(name, notes, userId, date, uniqueId);
        sqlInsert.finalize();
        returnObj.uniqueId = uniqueId
        returnObj.error = false;
        response.json(returnObj);
        response.end();
    } catch (err) {
        console.log(err);
        returnObj.error = true;
        response.json(returnObj);
        response.end();
    }
}

module.exports = {
    getAllMedicalConditions,
    editMedicalCondition,
    addMedicalCondition,
    getMedicalConditionInfo
};