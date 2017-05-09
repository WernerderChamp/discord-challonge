var exports = module.exports = {};
var db=require("./db.js");
const config = require("./config.json");

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.isAvaible(id,function(bool){
    if(bool){
      getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage)
      return console.log("Result submitted sucessfully");

    }
    else return console.log("You have already submitted a result");
  })
};

function getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.getID(tourneyID,winnerSeed,function(winnerID){
    db.getID(tourneyID,looserSeed,function(looserID){
      getMatch(channel,id,tourneyID,winnerID,looserID,stars,percentage);
    })
  })
}

function getMatch(channel,id,tourneyID,winnerID,looserID,stars,percentage){
}
