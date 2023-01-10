const mysql = require('mysql');
const data = require('./data');

const con = mysql.createConnection({
    host: "database",
    user: "database",
    password: "abc",
    database: "test",
    insecureAuth : true
});

con.connect(function (err) {
    if (err) return console.log("failed to connect to the database/server", err);
    else return console.log("Connection establish with Database!!!!");
});

const refreshAll = async () => {

    await con.query("DROP TABLE IF EXISTS Recipes;",
        (err, result) => {
            if (err) {
                console.log(err)
            }
        });

    await con.query("CREATE TABLE Recipes (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL,description VARCHAR(255),category VARCHAR(255), ingredients VARCHAR(255));",
        (err, result) => {
            if (err) {
                console.log(err)
            }
        });

    await data.forEach(element => {
        con.query("INSERT INTO Recipes (title, description, category, ingredients) VALUES (?,?,?,?);", [element.title, element.description, element.category, element.ingredients], (err, result) => {
            if (err) {
                console.log(err)
            }
        })
    });
}
refreshAll();

module.exports = con;
