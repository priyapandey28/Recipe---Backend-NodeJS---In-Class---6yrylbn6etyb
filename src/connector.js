
var mysql = require('mysql');
const data = require('./data');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "a",
    database: "test",
    multipleStatements: true
});


connection.connect(function (err) {
    if (err) return console.log("failed to connect to mysql server/ database", err);
    else return console.log("connection establish with Datebase!!!!");
});

const refreshAll = async () => {

    await connection.query("DROP TABLE IF EXISTS Recipes;",
        (err, result) => {
            if (err) {
                console.log(err)
            }
        });

    await connection.query("CREATE TABLE Recipes (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL,description VARCHAR(255),category VARCHAR(255), ingredients VARCHAR(255));",
        (err, result) => {
            if (err) {
                console.log(err)
            }
        });

    await data.forEach(element => {
        connection.query("INSERT INTO Recipes (title, description, category, ingredients) VALUES (?,?,?,?);", [element.title, element.description, element.category, element.ingredients], (err, result) => {
            if (err) {
                console.log(err)
            }
        })
    });
}
refreshAll();

module.exports = connection;