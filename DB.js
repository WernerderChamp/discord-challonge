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
        connection.query('SELECT * FROM `seeds` WHERE seedNumber = ? AND tourneyID = ?',[seedNumber,tourneyID],function(err,results,fields){

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
        connection.query('SELECT * FROM `discord` WHERE discordID = ?',[authorID],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              if(!results[0]) {
                addMember(authorID);
                return callback(true);
              }
              if(results[0].report==0){
                callback(true)
              }
              else callback(false);
            } else {
              console.log(err);
              callback(false);
            }
        });

        connection.on('error', function(err) {
              console.log("Error: "+err);
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
        connection.query('INSERT INTO `discord` SET ?',{discordID: authorID, report: 0},function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
            } else{
              console.log(err);
            }
          });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}

exports.setState=function(authorID,tourneyID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query('UPDATE `discord` SET report = ? WHERE discordID = ?',[tourneyID,authorID],function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              callback(true);
              console.log("OK "+connection.threadId);
            } else {
              console.log(err);
            }
          });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}

exports.isalreadyLogged=function(matchID,tourneyID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM `calls` WHERE matchID = ? AND tourneyID = ?',[matchID,tourneyID],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              console.log("Checking if logged")
              if(!results[0]) callback(false)
              else callback(true);
            } else {
              console.log(err);
            }
        });
        connection.on('error', function(err) {
              console.log("Error: "+err);
            });
  });
}
exports.getReport=function(matchID,tourneyID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM `calls` WHERE matchID = ? AND tourneyID = ?',[matchID,tourneyID],function(err,results,fields){

            connection.release();
            if(!err) {
              //parsing stuff
              console.log("OK "+connection.threadId);
              callback(results[0]);
          } else{
            console.log(err);
          }
        });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}

exports.report=function(matchID,tourneyID,id,winnerID,looserID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected

        console.log('connected as id ' + connection.threadId);
        connection.query('INSERT INTO `calls` SET ?',{matchID: matchID, tourneyID: tourneyID, reporterID: id, winnerID: winnerID, looserID: looserID},function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              callback(true);
              console.log("OK "+connection.threadId);
            } else{
              console.log(err);
            }
          });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}

exports.deleteMatch=function(matchID,tourneyID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected

        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE from `calls` WHERE matchID = ? AND tourneyID = ?',[matchID, tourneyID],function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              callback(true);
              console.log("OK "+connection.threadId);
            } else{
              callback(0);
              console.log(false);
            }
          });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}

exports.reset=function(tourneyID,callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected
        console.log('connected as id ' + connection.threadId);
        connection.query('UPDATE `discord` SET report = 0 WHERE report = ?',[tourneyID],function(err,rows){
            connection.release();
            if(!err) {
              //parsing stuff
              callback(true);
              console.log("OK "+connection.threadId);
            } else {
              console.log(err);
            }
          });
        connection.on('error', function(err) {
              console.log("Error: "+err);
        });
  });
}
