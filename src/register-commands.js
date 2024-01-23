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
  {
    name: "info",
    description: "Afficher les tarifs des commandes salon et snipe",
    type: ApplicationCommandOptionType.Subcommand,
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Enregistrement des commandes...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Les commandes ont bien été enregistrées.");
  } catch (error) {
    console.log(`Une erreur est survenue : ${error}`);
  }
})();
