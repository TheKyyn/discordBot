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
  {
    name: "market",
    description: "Ajouter un personnage au marché",
    options: [
      {
        name: "character",
        description: "Nom du personnage à mettre sur le marché",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "exchange",
        description: "Personnage ou série souhaitée en échange",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  {
    name: "showmarket",
    description: "Afficher les personnages disponibles sur le marché",
    type: ApplicationCommandOptionType.Subcommand,
  },
  {
    name: "removemarket",
    description: "Retirer un personnage du marché",
    options: [
      {
        name: "character",
        description: "Nom du personnage à retirer du marché",
        type: ApplicationCommandOptionType.String,
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
