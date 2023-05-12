const { Client, IntentsBitField, Message } = require("discord.js");
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} est en ligne.`);
});

client.on("messageCreate", (message) => {
  if (message.content === "slt") {
    message.reply("salut");
  }
});

client.login(process.env.myToken);
