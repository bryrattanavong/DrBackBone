const {genRandomString} = require('./utils');
const {
    getOperationsDb
} = require('./db');

function getAllOperations(request, response) {
    let returnObj = {};

    let userID = request.body.userId;
    let listOfOperations = [];
    let database = getOperationsDb();
    const sql = `SELECT name, date, uniqueId FROM operations WHERE userId LIKE "%${userID}%" ORDER BY date;`;
    database.all(sql, [], (err, row = []) => {
        row.forEach((element) => {
            listOfOperations.push({
                name: element.name,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfOperations;
        response.json(returnObj);
        response.end();
    });
}

function editOperation(request, response) {
    var returnObj = {};
    let database = getOperationsDb();
    let {
        medicalConditionId,
        name,
        notes,
        userId,
        date,
        uniqueId
    } = request.body;

    var sqlUpdate = `UPDATE operations SET medicalConditionId = ${medicalConditionId}, name = ${name}, notes = ${notes}, userId = ${userId}, date = ${date} WHERE uniqueId LIKE "%${uniqueId}%";`;
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

function getOperationInfo(request, response) {
    let returnObj = {};

    let uniqueId = request.body.uniqueId;
    let database = getOperationsDb();
    const sql = `SELECT * FROM operations WHERE uniqueId LIKE "%${uniqueId}%"`;
    let listOfOperations = [];
    database.all(sql, [], (err, row = []) => {
        row.forEach((element) => {
            listOfOperations.push({
                medicalConditionId: element.medicalConditionId,
                name: element.name,
                notes: element.notes,
                userId: element.userId,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfOperations;
        response.json(returnObj);
        response.end();
    });
}

function addOperation(request, response) {
    let returnObj = {};
    let database = getOperationsDb();
    const uniqueId = genRandomString(16);
    let {
        medicalConditionId,
        name,
        notes,
        userId,
        date
    } = request.body;

    try {
        var sqlInsert = database.prepare('INSERT INTO operations (medicalConditionId, name, notes, userId, date, uniqueId) VALUES (?, ?,?,?,?,?);');
        sqlInsert.run(medicalConditionId, name, notes, userId, date, uniqueId);
        sqlInsert.finalize();
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
    getAllOperations,
    editOperation,
    addOperation,
    getOperationInfo
};