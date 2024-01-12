const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "add",
    description: "Calcul la somme des valeurs entrées",
    options: [
      {
        name: "premiere-valeur",
        description: "Première valeur :",
        type: "NUMBER",
        required: true,
      },
      {
        name: "deuxieme-valeur",
        description: "Deuxième valeur :",
        type: "NUMBER",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const num1 = interaction.options.getNumber("premiere-valeur");
    const num2 = interaction.options.getNumber("deuxieme-valeur");

    await interaction.reply(`La somme des valeurs entrées est ${num1 + num2}`);
  },
};
