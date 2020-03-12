const sqlite3 = require('sqlite3');

const {genRandomString} = require('./utils');
const {
    getMedicationsDb
} = require('./db');

function getAllMedications(request, response) {
    let returnObj = {};
    let userID = request.body.userId;
    let listOfMedications = [];
    let database = getMedicationsDb();
    const sql = `SELECT name, date, uniqueId FROM medications WHERE userId LIKE "%${userID}%" ORDER BY date;`;
    database.all(sql, [], (err, row = []) => {
        if (row) {
            row.forEach((element) => {
                listOfMedications.push({
                    name: element.name,
                    date: element.date,
                    uniqueId: element.uniqueId
                });
            });
            returnObj.results = listOfMedications;
            response.json(returnObj);
            response.end();
        }
    });
}

function editMedication(request, response) {
    var returnObj = {};
    let database = getMedicationsDb();
    let {
        medicalConditionId,
        name,
        dose,
        frequency,
        timePeriod,
        notes,
        userId,
        date,
        uniqueId
    } = request.body;

    var sqlUpdate = `UPDATE medication SET medicalConditionId = ${medicalConditionId}, name = ${name}, dose = ${dose}, frequency = ${frequency}, timePeriod = ${timePeriod}, notes = ${notes}, userId = ${userId}, date = ${date} WHERE uniqueId LIKE "%${uniqueId}%";`;
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

function getMedicationInfo(request, response) {
    let returnObj = {};

    let uniqueId = request.body.uniqueId;
    let listOfMedications = [];
    let database = getMedicationsDb();
    const sql = `SELECT * FROM medications WHERE uniqueId LIKE "%${uniqueId}%"`;
    database.all(sql, [], (err, row = []) => {
        row.forEach((element) => {
            listOfMedications.push({
                medicalConditionId: element.medicalConditionId,
                name: element.name,
                dose: element.dose,
                frequency: element.frequency,
                timePeriod: element.timePeriod,
                notes: element.notes,
                userId: element.userId,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfMedications;
        response.json(returnObj);
        response.end();
    });
}

function addMedication(request, response) {
    let returnObj = {};
    let database = getMedicationsDb();
    const uniqueId = genRandomString(16);
    let {
        medicalConditionId,
        name,
        dose,
        frequency,
        timePeriod,
        notes,
        userId,
        date,
    } = request.body;

    try {
        var sqlInsert = database.prepare('INSERT INTO medications (medicalConditionId, name, dose, frequency, timePeriod, notes, userId, date, uniqueId) VALUES (?,?,?,?,?,?,?,?,?);');
        sqlInsert.run(medicalConditionId, name, dose, frequency, timePeriod, notes, userId, date, uniqueId);
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
    getAllMedications,
    editMedication,
    addMedication,
    getMedicationInfo
};