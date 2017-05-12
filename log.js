var exports = module.exports = {};
var db=require("./DB.js");
var main=require("./bot.js");
const config = require("./config.json");

const challonge = require('challonge');
const tournament = challonge.createClient({
  apiKey: config.challonge
});

exports.log=function(channel,id,tourneyID,winnerSeed,looserSeed,liaison){
  if(liaison>=1) return getIDs(channel,id,tourneyID,winnerSeed,looserSeed,liaison);
  db.isAvaible(id,function(bool){
    if(bool) getIDs(channel,id,tourneyID,winnerSeed,looserSeed)
    else return channel.send("You have already submitted a result");
  })
};

function getIDs(channel,id,tourneyID,winnerSeed,looserSeed,liaison){
  db.getID(tourneyID,winnerSeed,function(winnerID){
    db.getID(tourneyID,looserSeed,function(looserID){
      getMatchID(channel,id,tourneyID,winnerID,looserID,liaison);
    })
  })
}

function getMatchID(channel,id,tourneyID,winnerID,looserID,liaison){
  var tourneyURL="";
  if(tourneyID==91) tourneyURL="FCIT_TH9_S1";
  if(tourneyID==92) tourneyURL="FCIT_TH9_S2";
  if(tourneyID==101) tourneyURL="FCIT_TH10_S1";
  if(tourneyID==102) tourneyURL="FCIT_TH10_S2";
  if(tourneyID==111) tourneyURL="FCIT_TH11_S1";
  if(tourneyID==112) tourneyURL="FCIT_TH11_S2";
  console.log(winnerID+" - "+looserID);
  tournament.matches.index({
    id: tourneyURL,
    participant_id: winnerID,
    callback: (err, data) => {
      var i=0;
      while(data[i]){
        if(data[i].match.player1Id==looserID||data[i].match.player2Id==looserID){
          return getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,data[i].match.id,liaison)
        }
        i++;
      }
      channel.send("I could not find the match you want to report for :(")
    }
  });
}

function getMatch(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID,liaison){
  if(liaison==2) return deleteMatch(channel,matchID,tourneyID,tourneyURL)
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
              if (!err) channel.send("Your report has been carefully recorded");
            }
          });
        });
      });
    }
  })
}

function deleteMatch(channel,matchID,tourneyID,tourneyURL){
  db.deleteMatch(matchID,tourneyID,function(response){
      if (response) return channel.send("Sucessfully erased report")
      else channel.send("An error has occured");
  });
}

function issue(channel,id,tourneyID,tourneyURL,winnerID,looserID,matchID,data){
  console.log("An issue has occured");
  db.setState(id,tourneyID,function(sucess2){});
  main.issue(channel,id,tourneyID,winnerID,looserID,matchID,data)
}
