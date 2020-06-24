// DISCORD AND COMMAND HANDLER
const Discord = require("discord.js");
//const { Client, Util } = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");

// Config and client
const client = new Discord.Client();
const config = require("./settings/config.json");
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
//const client = new Client({ disableEveryone: true });
client.config = config
client.Discord = Discord;


const http = require('http');
const server = require('./server.js');


 const newM = ["Seems OP!", "ALL HELD DA GOD!!", "Popcorn?", "Are you a Goon Squad member?", "BANZAI!!!", "You looks good", "Are you Janna?"];

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    //console.log(`Попытка загрузить команду ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/gamecate/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/gamecate/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/rank/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/rank/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

// JUST IN CASE OF ANY ERROR OF DISCORD.JS
client.on("error", (o_O) => {});

// On bot ready function
client.on('ready', () => {

  // Set status online.size users.size
  client.user.setStatus('online') // Set status
  //client.user.setPresence({game: {name: `${client.users.size} users`, type: 2}});
  
let currentActivity = 0
var cc = client.users.size
setInterval(async () => {
currentActivity++
//if (currentActivity === 2) currentActivity++
  
if (currentActivity > 8) {
  currentActivity = 0
}
  switch (currentActivity) {
    case 0:
      client.user.setActivity(`Regis support`, {type: 'WATCHING'})
      break
    case 1:
      client.user.setActivity(`LeagueOfLegends`, {type: 'PLAYING'})
      break
    case 2:
      client.user.setActivity(`my mind`, {type: 'LISTENING'})
      break
    case 3:
      client.user.setActivity(`${cc} Users`, {type: 'LISTENING'})
      break
    case 4:
      client.user.setActivity(`My Admins`, {type: 'WATCHING'})
      break
    case 5:
      client.user.setActivity(`twitch.tv/regislol`, {type: 'WATCHING'})
      break
    case 6:
      client.user.setActivity(`replays`, {type: 'WATCHING'})
      break
    case 7:
      client.user.setActivity(`Anime`, {type: 'WATCHING'})
      break
    case 8:
      client.user.setActivity(`=ranks`, {type: 'LISTENING'})
      break
  }
},15000)
  
  client.user.setActivity(`${cc} Users`, {type: 'LISTENING'})
  
  console.log('BOT is now online!')
});

// Sort functions for commands
//Welcome and promote new member 
 client.on("guildMemberAdd", function(member) {
    if (member.bot) {
      var respond = (newM[Math.floor(Math.random() * newM.length)])
      let guild = member.guild;
      var embed = new Discord.RichEmbed()
      .setColor(0x15f153)
      .setTimestamp()
      .setFooter(config.MODver)
      .addField('Bot Update',
        `:pushpin: :wave: ${member.bot} Bot Join.`)
      .addField('Bot ID',
        `${member.id}`)
      client.channels.find("name", "member-log").send(embed);// announce on preferred text channel.  
      client.channels.find("name", "public-chat").send(`Hi ${member.user}, welcome to **${config.server} discord server**!
Have you read our rules and guides at #welcome? go check it out!
Type **=ranks** to check out my accounts ranks!`);
    } else {
    var respond = (newM[Math.floor(Math.random() * newM.length)])
    let guild = member.guild;
    var embed = new Discord.RichEmbed()
      .setColor(0x015f153)
      .setTimestamp()
      .setFooter(config.MODver)
      .addField('Member Update',
        `:pushpin: :white_check_mark: ${member.user} join the server!`)
      .addField('Member ID',
        `${member.id}`)
      .addField('Member Roles',
        `${guild.roles.find("name", "Member")}`)//This only display user roles at first join only
    client.channels.find("name", "member-log").send(embed); // announce on preferred text channel. 
    member.addRole(member.guild.roles.find("name", "Member")); //Grant roles if is user
    client.channels.find("name", "public-chat").send(`${member.user} has arrived to **${config.server} discord server**! ${respond}`);
}
});

//If user left the server, announce it
 client.on("guildMemberRemove", function(member) {
    if (member.bot) {
      let guild = member.guild;
      var embed = new Discord.RichEmbed()
      .setColor(0xff0505)
      .setTimestamp()
      .setFooter(config.MODver)
      .addField('Bot Update',
        `:pushpin: :x: ${member.bot} Bot Left.`)
      .addField('Bot ID',
        `${member.id}`)
      client.channels.find("name", "member-log").send(embed); // announce on preferred text channel. 
    } else {

    let guild = member.guild;
    var embed = new Discord.RichEmbed()
      .setColor(0xff0505)
      .setTimestamp()
      .setFooter(config.MODver)
      .addField('Member Update',
        `:pushpin: :x: ${member.user} left the server!`)
      .addField('Member ID',
        `${member.id}`)
    client.channels.find("name", "member-log").send(embed); // announce on preferred text channel. 
}
});


client.on('messageDelete', async (message) => {
    const logs = message.guild.channels.find('name', 'del-logs');
    if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await message.guild.createChannel('del-logs', 'text');
    }
    if (!logs) {
        return console.log('The logs channel does not exist and cannot be created')
    }
    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first())
    let user;
    if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
        user = entry.executor.username
    } else {
        user = message.author
    }
    const logembed = new Discord.RichEmbed()
        //.setTitle('Message Deleted')
        .setAuthor(user.tag, message.author.displayAvatarURL)
        .addField(`**Message sent by ${message.author.username}> deleted in ${message.channel.name}**\n\n`, message.content)
        .setColor(message.guild.member(client.user).displayHexColor)
        .setFooter(`<#${message.channel.id}>`)
        .setTimestamp()
    //console.log(entry)
    logs.send(logembed);
});
//live-streaming
/*client.on('presenceUpdate', (oldMember, newMember) => {
    if (oldMember.presence.game !== newMember.presence.game) {
        let channel = client.channels.find('name', 'live-stream');
        if (newMember.presence.game && newMember.presence.game.url) {
            channel.send(`Hey everyone!
**${newMember.user.tag}** just started streaming. See them live at **${newMember.presence.game.url}**!\nTitle: **${newMember.presence.game.name}**`);
        } 
    }
});*/

// Login to Discord API
client.login(process.env.TOKEN);
