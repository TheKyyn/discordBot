const {
  PermissionsBitField,
  ChannelType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { pendingTransactions } = require("../database");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;
    const user = interaction.user.id;

    switch (command) {
      case "salon":
        await handleSalonCommand(interaction);
        break;
      case "snipe":
        await handleSnipeCommand(interaction);
        break;
      default:
        interaction.reply("Commande non reconnue.");
    }

    function calculateDuration(type, amount) {
      const salonDurations = {
        500: 60, // 1 minute
        1000: 120, // 2 minutes
        1500: 180, // 3 minutes
        2000: 240, // 4 minutes
        2500: 300, // 5 minutes
      };
      const snipeDurations = {
        600: 60, // 60 secondes
        3000: 300, // 5 minutes
        5000: 600, // 10 minutes
        8500: 3600, // 1 heure
        25000: 86400, // 1 journée
      };

      return type === "salon" ? salonDurations[amount] : snipeDurations[amount];
    }

    async function handleSalonCommand(interaction) {
      // Demander la durée du salon
      const amount = interaction.options.getInteger("amount");
      if (!Object.keys(salonDurations).includes(amount.toString())) {
        interaction.reply("Quantité de kakeras invalide pour un salon.");
        return;
      }

      const duration = calculateDuration("salon", amount);
      pendingTransactions.set(user, {
        type: "salon",
        amount,
        duration,
        channelId: interaction.channelId,
      });

      interaction.reply(
        `Paiement de ${amount} kakeras pour un salon de ${duration} secondes attendu. Confirmez avec 'o'.`
      );
    }

    async function handleSnipeCommand(interaction) {
      // Demander la durée du snipe
      const amount = interaction.options.getInteger("amount");
      if (!Object.keys(snipeDurations).includes(amount.toString())) {
        interaction.reply("Quantité de kakeras invalide pour un snipe.");
        return;
      }

      const duration = calculateDuration("snipe", amount);
      pendingTransactions.set(user, {
        type: "snipe",
        amount,
        duration,
        channelId: interaction.channelId,
      });

      interaction.reply(
        `Paiement de ${amount} kakeras pour un snipe de ${duration} secondes attendu. Confirmez avec 'o'.`
      );
    }
  },
};
