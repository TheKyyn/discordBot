const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "add",
    description: "Calcul la somme des valeurs entrées",
    options: [
      {
        name: "premiere-valeur",
        description: "Première valeur :",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "deuxieme-valeur",
        description: "Deuxième valeur :",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "embed",
    description: "Envoie un message 'embed'.",
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Enregistrement des commandes...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.clientId,
        process.env.guildId
      ),
      { body: commands }
    );

    console.log("Les commandes ont bien été enregistrées.");
  } catch (error) {
    console.log(`Une erreur est survenue : ${error}`);
  }
})();
