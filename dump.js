const config = require("./config.json");
var exports = module.exports = {};

var mysql      = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 10, //important
    host     : 'localhost',
    user     : 'root',
    password : config.password,
    database : 'ffcc',
    debug    :  false
});

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});
//--------------------------

exports.clear=function(){
  clear(function(bool){
    if(bool) dump();
  })
}

//--------------------------
function dump(){
tourneyURLs=["FCIT_TH9_S1","FCIT_TH9_S2","FCIT_TH10_S1","FCIT_TH10_S2","FCIT_TH11_S1","FCIT_TH11_S2"];
tourneyIDs=["91","92","101","102","111","112"];
for(var j=0;j<tourneyURLs.length;j++){
  tourneyURL=tourneyURLs[j];
  tourneyID=tourneyIDs[j];
//start of actual dumping progress
	extract(tourneyURL,tourneyID);
}
}

function extract(tourneyURL,tourneyID){
	tournament.participants.index({
  id: tourneyURL,
  callback: (err, data) => {
    if(err) console.log(err);
    for(var i=0;data[i];i++){
      console.log(i);
      save(data[i].participant.id,tourneyID,data[i].participant.seed)
    }
  }
});
}

function clear(callback){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected

        console.log('connected as id ' + connection.threadId);
        connection.query('TRUNCATE seeds',function(err,rows){
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

function save(tournamentID,tourneyID,seedNumber){
  //Creates a database connection
    pool.getConnection(function(err,connection){
        if (err) {
          callback("Error: "+err);
        }
        //Successfully connected

        console.log('connected as id ' + connection.threadId);
        connection.query('INSERT INTO `seeds` SET ?',{tournamentID: tournamentID, tourneyID: tourneyID, seedNumber:seedNumber},function(err,rows){
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
