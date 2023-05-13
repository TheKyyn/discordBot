const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
require("dotenv").config();

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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("premiere-valeur").value;
    const num2 = interaction.options.get("deuxieme-valeur").value;

    interaction.reply(`La somme des valeurs entrées est ${num1 + num2}`);
  }

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("Ceci est un embed")
      .setColor('Random');

    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
