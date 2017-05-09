var exports = module.exports = {};
var db=require("./db.js");
const config = require("./config.json");

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.isAvaible(id,function(bool){
    if(bool) return console.log("Result submitted sucessfully"); //getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage)
    else return console.log("You have already submitted a result");
  })
}
