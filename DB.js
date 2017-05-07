var exports = module.exports = {};
const config = require("./config.json");

var mysql      = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 10, //important
    host     : 'localhost',
    user     : 'root',
    password : config.password,
    database : 'ffc',
    debug    :  false
});

function getID(authorID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query("SELECT * FROM members WHERE id = ?",[authorID],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              callback(results[0].challongeID);
            } else {
              console.log(err);
            }
        });

        connection.on('error', function(err) {
              callback("Error: "+err);
        });
  });
}
