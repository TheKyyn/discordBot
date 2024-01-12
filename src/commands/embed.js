const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "embed",
    description: "Envoie un message 'embed'.",
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("Ceci est un embed")
      .setColor('Random');

    await interaction.reply({ embeds: [embed] });
  },
};
