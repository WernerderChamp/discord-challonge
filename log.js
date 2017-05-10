var exports = module.exports = {};
var db=require("./db.js");
const config = require("./config.json");

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed){
  db.isAvaible(id,function(bool){
    if(bool) getIDs(channel,id,tourneyID,winnerSeed,looserSeed)
    else return channel.send("You have already submitted a result");
  })
};

function getIDs(channel,id,tourneyID,winnerSeed,looserSeed){
  db.getID(tourneyID,winnerSeed,function(winnerID){
    db.getID(tourneyID,looserSeed,function(looserID){
      getMatchID(channel,id,tourneyID,winnerID,looserID);
    })
  })
}

function getMatchID(channel,id,tourneyID,winnerID,looserID){
  var tourneyURL="1xaq3xtd";
  console.log(winnerID+" - "+looserID);
  tournament.matches.index({
    id: tourneyURL,
    participant_id: winnerID,
    callback: (err, data) => {
      var i=0;
      while(data[i]){
        if(data[i].match.player1Id==looserID||data[i].match.player2Id==looserID){
          return getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,data[i].match.id)
        }
        i++;
      }
      channel.send("I could not find the match you want to report for :(")
    }
  });
}

function getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID){
  db.isalreadyLogged(matchID,tourneyID,function(bool){
    if(bool){
      //match already reported
      db.getReport(matchID,tourneyID,function(data){
        if (winnerID==data.winnerID) return channel.send("You opponent has reported exactly the same :)")
        //reports do not match
        else return issue(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID,data);
      })
    } else {
      db.report(matchID,tourneyID,id,winnerID,looserID,function(sucess){
        if(sucess) db.setState(id,tourneyID,function(sucess2){
          tournament.matches.update({
            id: tourneyURL,
            matchId: matchID,
            match: {
              scoresCsv: '1-0',
              winnerId: winnerID
            },
            callback: (err, data) => {
              channel.send("Your report has been carefully recorded");
            }
          });
        });
      });
    }
  })
}

function issue(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID,data){
  console.log("An issue has occured");
  db.setState(id,tourneyID,function(sucess2){});
  channel.send("Oh no! An issue has occured");
}
