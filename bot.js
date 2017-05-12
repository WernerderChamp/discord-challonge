const Discord = require("discord.js");
const bot = new Discord.Client();
var moment = require('moment');
const config = require("./config.json");
var log=require("./log.js");
var db=require("./DB.js");
var dump=require("./dump.js");

bot.on("ready", () => {
  //Log Time when bot is ready and set status
	var time=moment().valueOf();
	console.log("Connected at "+time);
	bot.user.setGame("Use ?help");
});

bot.on("disconnect", (evt) => {
  //Fallback if bot gets disconnected
	var time=moment().valueOf();
	console.log("DISCONNECTED at "+time+"!!!\nCode "+evt.code+"\nReason: "+evt.reason);
  //restart bot if Cloudflare is again giving random errors :(
 if (evt.code==1000) setTimeout(process.exit,1000);

});


bot.on("message", message => {
  //If bot has a new message
	if (message.author.bot) return;//ignore bots
	if (!message.content.startsWith(config.prefix)) return;//ignore messages that don't start with prefix
	var time = moment().valueOf();
	console.log(time+": "+message.channel+": "+message.author+" : "+message.content);//Log all commands
  //Splits content into array
	let command = message.content.split(" ")[0];
	command = command.slice(config.prefix.length);

	let args = message.content.split(" ").slice(1);

  if(command==="help"){
      if(message.channel.id!=config.liaison) return message.channel.send("You don't have permission to use this command");
  } else
  if(command==="prune"){
    dump.clear();
  } else
  if(command==="reset"){
    if(message.channel.id!=config.liaison) return message.channel.send("You don't have permission to use this command");
    if(isNaN(args[0])) return message.channel.send("Use ?reset <tourneyID>");
    var tourneyID=parseInt(args[0]);
    db.reset(tourneyID,function(bool){
      if(bool) message.channel.send("Sucessfully cleared");
    })
  } else
  if (command==="delete"){
    if(isNaN(args[0])||isNaN(args[1])||isNaN(args[2])) return message.channel.send("Use ?delete <tourneyID> <seedNumberWinner> <seed Number Looser>");
    if(message.channel.id!=config.liaison) return message.channel.send("You don't have permission to use this command");
    var tourneyID=parseInt(args[0]);
    var winnerSeed=parseInt(args[1]);
    var looserSeed=parseInt(args[2]);
    var tourneyName;
    if(tourneyID==91) tourneyName="TH9 Schedule 1";
    if(tourneyID==92) tourneyName="TH9 Schedule 2";
    if(tourneyID==101) tourneyName="TH10 Schedule 1";
    if(tourneyID==102) tourneyName="TH10 Schedule 2";
    if(tourneyID==111) tourneyName="TH11 Schedule 1";
    if(tourneyID==112) tourneyName="TH11 Schedule 2";
    //Discord Message Collector waits for another message in this channel
    message.channel.send("Are you sure you want to delete the result of the match"+winnerSeed+" vs "+looserSeed+"?\n(y/n)")
    var collector = message.channel.createCollector(
      m => m.author.id==message.author.id,
      {time: 90000});//Automaticly quits after 90 seconds
    collector.on('collect', m =>{
      if (m.content==="y") {
        log.log(message.channel,message.author.id,tourneyID,winnerSeed,looserSeed,2);
        collector.stop(1)
      } else
      if (m.content==="n") {
        collector.stop(0)
      } else {
       message.channel.send("Please enter y or n");
      }
    })
    collector.on('end', (collected, reason)=>{
      if (reason===1) return;//Collector ended normally and called log function
      else message.channel.send("Aborted");
    })
  }
  if (command==="report"){
    if(isNaN(args[0])||isNaN(args[1])||isNaN(args[2])) return message.channel.send("Use ?report <tourneyID> <seedNumberWinner> <seed Number Looser>");
    //parse params
    var liaison=0;
    if(message.channel.id==config.liaison) liaison=1;
    var tourneyID=parseInt(args[0]);
    var winnerSeed=parseInt(args[1]);
    var looserSeed=parseInt(args[2]);
    var tourneyName;
    if(tourneyID==91) tourneyName="TH9 Schedule 1";
    if(tourneyID==92) tourneyName="TH9 Schedule 2";
    if(tourneyID==101) tourneyName="TH10 Schedule 1";
    if(tourneyID==102) tourneyName="TH10 Schedule 2";
    if(tourneyID==111) tourneyName="TH11 Schedule 1";
    if(tourneyID==112) tourneyName="TH11 Schedule 2";
    //Discord Message Collector waits for another message in this channel
    message.channel.send("Do you want to report the following match result?\n"+winnerSeed+" won against "+looserSeed+"\n(y/n)")
    var collector = message.channel.createCollector(
      m => m.author.id==message.author.id,
      {time: 90000});//Automaticly quits after 90 seconds
    collector.on('collect', m =>{
      if (m.content==="y") {
        log.log(message.channel,message.author.id,tourneyID,winnerSeed,looserSeed,liaison);
        collector.stop(1)
      } else
      if (m.content==="n") {
        collector.stop(0)
      } else {
       message.channel.send("Please enter y or n");
      }
    })
    collector.on('end', (collected, reason)=>{
      if (reason===1) return;//Collector ended normally and called log function
      else message.channel.send("Aborted");
    })
  }
  //To be continured...
});

exports.issue=function(channel,id,tourneyID,winnerID,looserID,matchID,data){
  var str="An issue has occured. Received two different reports for match "+matchID+" in Tourney "+tourneyID+"\n\n";
  str+="Old report by <@!"+data["reporterID"]+">: "+data["winnerID"]+" won against "+data["looserID"]+"\n";
  str+="New report by <@!"+id+">: "+winnerID+" won against "+looserID+"\n";
  bot.channels.get('308662041860898816').send(str);
}

bot.login(config.token);
