const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "salon",
    description: "Créer un salon temporaire",
    options: [
      {
        name: "amount",
        description: "Montant des kakeras pour le salon",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: "snipe",
    description: "Exclure un utilisateur temporairement",
    options: [
      {
        name: "amount",
        description: "Montant des kakeras pour le snipe",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
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
