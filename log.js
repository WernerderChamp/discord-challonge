var exports = module.exports = {};
var db=require("./db.js");

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.isAvaible(id,function(bool){
    if(bool) return //getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage)
    else return channel.send("You have already submitted a report")
  })
}
