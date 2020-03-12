const {getUsersDb} = require('./db');
const {sha512, genRandomString} = require('./utils');

function checkPassword(password) {
    if (password.length < 6) {
        return ("Password too short!");
    } else if (password.search(/\d/) === -1) {
        return ("Password doesn't contain numbers!");
    } else if (password.search(/[a-zA-Z]/) === -1) {
        return ("Password doesn't contain any letters!");
    }
    return ("ok");
}

function login(request, response) {
    var usersDB = getUsersDb();
    var returnObj = {};
    var tempUser = request.body.username.toUpperCase();
    var tempPass = request.body.password;
    var sqlQuery = 'SELECT ' + process.env.LOGIN_TABLE + ', hash, userId FROM ' + process.env.LOGIN_DB + ' WHERE ' + process.env.LOGIN_KEY + ' LIKE "%' + tempUser + '%";';
    usersDB.all(sqlQuery, [], (err, rows) => {
        if (err)
            throw err;
        rows.forEach((element) => {
            if (element[process.env.LOGIN_TABLE] === (sha512(tempPass, element.hash).passwordHash)) {
                returnObj.userId = element.userId;
            }
        });
        response.json(returnObj);
    });
}

function signup(request, response) {
    var usersDB = getUsersDb();
    var returnObj = {};
    var tempUser = request.body.username.toUpperCase();
    var tempPass = request.body.password;
    var sqlQuery = 'SELECT * FROM ' + process.env.LOGIN_DB + ' WHERE ' + process.env.LOGIN_KEY + ' LIKE "%' + tempUser + '%";';
    usersDB.all(sqlQuery, [], (err, rows) => {
        if (err)
            throw err;
        if (rows.length !== 0) {
            returnObj.error = true;
            returnObj.passwordError = "User already exists";
            response.json(returnObj);
        } else if (tempUser === "" || tempUser === null) {
            returnObj.error = true;
            returnObj.passwordError = "Username is invalid.";
            response.json(returnObj);
        } else {
            const goodPass = checkPassword(tempPass);
            const newSalt = genRandomString(16);
            const userId = genRandomString(16);
            const newPass = sha512(tempPass, newSalt);
            if (goodPass === ('ok')) {
                var sqlInsert = usersDB.prepare('INSERT INTO ' + process.env.LOGIN_DB + ' (' + process.env.LOGIN_KEY + ', ' + process.env.LOGIN_TABLE + ', hash, userId) VALUES (?,?,?,?);');
                sqlInsert.run(tempUser, newPass.passwordHash, newSalt, userId);
                sqlInsert.finalize();
                returnObj.error = false;
                returnObj.userId = userId;
                response.json(returnObj);
            } else {
                returnObj.error = true;
                returnObj.passwordError = goodPass;
                response.json(returnObj);
            }
        }
    });
}


module.exports = {
    login,
    signup
};