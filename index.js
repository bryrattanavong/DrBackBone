require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const { initDbs } = require('./db');
const { login, signup } = require('./authentications')
const { getAllMedications, editMedication, addMedication, getMedicationInfo } = require('./medications')
const{ getAllMedicalConditions, editMedicalCondition, addMedicalCondition, getMedicalConditionInfo} = require('./medicalConditions');
const{ getAllOperations, editOperation, addOperation, getOperationInfo} = require('./operations');
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'))


// Authentication routes
app.post('/login', (request, response) => {
    login(request, response);
});

app.post('/signup', (request, response) => {
    signup(request, response);
});

//Medication routes
app.post('/getAllMedications', (request, response) => {
    getAllMedications(request, response);
});

app.post('/addMedication', (request, response) => {
    addMedication(request, response);
});

app.post('/editMedication', (request, response) => {
    editMedication(request, response);
});

app.post('/getMedicationInfo', (request, response) => {
    getMedicationInfo(request, response);
});

//Medical Condition routes
app.post('/getAllMedicalConditions', (request, response) => {
    getAllMedicalConditions(request, response);
});

app.post('/addMedicalCondition', (request, response) => {
    addMedicalCondition(request, response);
});

app.post('/editMedicalCondition', (request, response) => {
    editMedicalCondition(request, response);
});

app.post('/getMedicalConditionInfo', (request, response) => {
    getMedicalConditionInfo(request, response);
});

//Operations routes
app.post('/getAllOperations', (request, response) => {
    getAllOperations(request, response);
});

app.post('/addOperation', (request, response) => {
    addOperation(request, response);
});

app.post('/editOperation', (request, response) => {
    editOperation(request, response);
});

app.post('/getOperationInfo', (request, response) => {
    getOperationInfo(request, response);
});

initDbs();

app.listen(port);
console.log('Listening on ' + port);