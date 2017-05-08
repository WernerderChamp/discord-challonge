var exports = module.exports = {};
const config = require("./config.json");

var mysql      = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 10, //important
    host     : 'localhost',
    user     : 'root',
    password : config.password,
    database : 'ffcc',
    debug    :  false
});

exports.getID=function(tourneyID,seedNumber,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query("SELECT * FROM ? WHERE seedNumber = ?",[tourneyID,seedNumber],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              callback(results[0].tournamentID);
            } else {
              console.log(err);
              callback(null);
            }
        });

        connection.on('error', function(err) {
              callback("Error: "+err);
        });
  });
}

exports.isAvaible=function(authorID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query("SELECT * FROM ? WHERE discordID = ?",[tourneyID,seedNumber],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              if(!results[0]) {
                addMember(authorID);
                return callback(true);
              }
              if(results[0].reported==true){

                callback(true)
              }
              else callback(false);
              callback(true);
            } else {
              console.log(err);
              callback(false);
            }
        });

        connection.on('error', function(err) {
              callback("Error: "+err);
        });
  });
}

function addMember(authorID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query("INSERT INTO `discord` SET ?"),[authorID,true],function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
            }
          }
        connection.on('error', function(err) {
              callback("Error: "+err);
        });
  });
}

function setState(authorID,bool,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query("UPDATE `discord` SET reported = ? WHERE discordID = ?"),[bool,authorID],function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
            }
          }
        connection.on('error', function(err) {
              callback("Error: "+err);
        });
  });
}
