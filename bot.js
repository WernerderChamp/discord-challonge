const challonge = require('challonge');
const Discord = require("discord.js");
const bot = new Discord.Client();
var moment = require('moment');

const tournament = challonge.createClient({
  apiKey: config.challonge
});

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
	msg_count++;
	if (message.author.bot) return;//ignore bots
	if (!message.content.startsWith(config.prefix)) return;//ignore messages that don't start with prefix
	var time = moment().valueOf();
	console.log(time+": "+message.channel+": "+message.author+" : "+message.content);//Log all commands
  //Splits content into array
	let command = message.content.split(" ")[0];
	command = command.slice(config.prefix.length);

	let args = message.content.split(" ").slice(1);

  //To be continured...
});
