const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Le bot est bien en ligne !");
});

// Importation des gestionnaires d'événements
const kakeraSystem = require("./events/kakeraSystem");
const transactionHandler = require("./events/transactionHandler");

// Ajout des gestionnaires d'événements
client.on("interactionCreate", kakeraSystem.execute);
client.on("messageCreate", transactionHandler.execute);

// Connexion du bot à Discord
client.login(process.env.TOKEN);
