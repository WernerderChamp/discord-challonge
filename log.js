var exports = module.exports = {};
var db=require("./db.js");
const config = require("./config.json");

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.isAvaible(id,function(bool){
    if(bool) getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage)
    else return channel.send("You have already submitted a result");
  })
};

function getIDs(channel,id,tourneyID,winnerSeed,looserSeed,stars,percentage){
  db.getID(tourneyID,winnerSeed,function(winnerID){
    db.getID(tourneyID,looserSeed,function(looserID){
      getMatchID(channel,id,tourneyID,winnerID,looserID,stars,percentage);
    })
  })
}

function getMatchID(channel,id,tourneyID,winnerID,looserID,stars,percentage){
  var tourneyURL="1xaq3xtd";
  console.log(winnerID+" - "+looserID);
  tournament.matches.index({
    id: tourneyURL,
    participant_id: winnerID,
    callback: (err, data) => {
      var i=0;
      while(data[i]){
        if(data[i].match.player1Id==looserID||data[i].match.player2Id==looserID){
          return getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,data[i].match.id,stars,percentage)
        }
        i++;
      }
      channel.send("I could not find the match you want to report for :(")
    }
  });
}

function getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID,stars,percentage){
  channel.send("Match ID: "+matchID)
}
