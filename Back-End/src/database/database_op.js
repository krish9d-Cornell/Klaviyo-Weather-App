const config = require("../config.json")
const db_credentials = config.database
var mysql = require('mysql')

// Connect to the database
function connect(){

    db = mysql.createConnection({
        host: 'localhost',
        user: db_credentials.user,
        password: db_credentials.password,
        database: db_credentials.db
    });

    db.connect((err) =>{
        if(err) console.log(err)
        else console.log("Connected to database")
    });

    let create_table = 'CREATE TABLE if not exists userData(email VARCHAR(255), location VARCHAR(255), PRIMARY KEY (email));'
    db.query(create_table, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });

    return db
}

module.exports.connect = connect;
