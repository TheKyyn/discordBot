require("./database");

const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const kakeraSystem = require("./events/kakeraSystem");
client.on("messageCreate", kakeraSystem.execute);

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log("Le bot est bien en ligne !");
});
