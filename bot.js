const Discord = require("discord.js");
const bot = new Discord.Client();
var moment = require('moment');
const config = require("./config.json");
var log=require("./log.js");

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
    //help
  } else
  if (command==="report"){
    if(isNaN(args[0])||isNaN(args[1])||isNaN(args[2])||isNaN(args[3])||isNaN(args[4])) return message.send("Use *report <tourneyID> <seedNumberWinner> <seed Number Looser> <stars> <percentage>");
    //parse params
    var tourneyID=parseInt(args[0]);
    var winnerSeed=parseInt(args[1]);
    var looserSeed=parseInt(args[2]);
    var stars=parseInt(args[3]);
    var percentage=parseInt(args[4]);
    var tourneyName;
    if(tourneyID==91) tourneyName="TH9 Schedule 1";
    if(tourneyID==92) tourneyName="TH9 Schedule 2";
    if(tourneyID==101) tourneyName="TH10 Schedule 1";
    if(tourneyID==102) tourneyName="TH10 Schedule 2";
    if(tourneyID==111) tourneyName="TH11 Schedule 1";
    if(tourneyID==112) tourneyName="TH11 Schedule 2";
    //Discord Message Collector waits for another message in this channel
    message.channel.send("Is this your best attack for the "+tourneyName+" tournament?\n"+stars+" Stars and "+percentage+" Percent? \n(y/n)")
    var collector = message.channel.createCollector(
      m => m.author.id==message.author.id,
      {time: 90000});//Automaticly quits after 90 seconds
    collector.on('collect', m =>{
      if (m.content==="y") {
        log.log(message.channel,message.author.id,tourneyID,winnerSeed,looserSeed,stars,percentage);
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

bot.login(config.token);
