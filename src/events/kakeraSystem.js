const {
  PermissionsBitField,
  ChannelType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { pendingTransactions } = require("../database");

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
      case "info":
        await handleInfoCommand(interaction);
        break;
      default:
        interaction.reply("Commande non reconnue.");
    }

    function calculateDuration(type, amount) {
      return type === "salon" ? salonDurations[amount] : snipeDurations[amount];
    }

    async function handleSalonCommand(interaction) {
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
        `Bien, merci d'effectuer la transaction via $givek avec Mudae pour un salon de ${duration} secondes.`
      );
    }

    async function handleSnipeCommand(interaction) {
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
        `Bien, merci d'effectuer la transaction via $givek avec Mudae pour un snipe de ${duration} secondes.`
      );
    }

    async function handleInfoCommand(interaction) {
      const infoMessage = `
      **Récapitulatif** : 

Lorsque la commande **/salon** est effectuée, il faudra d'abord rentrer la valeur en kakeras que tu souhaites payer en fonction de la durée que tu souhaites attribuer à ton salon temporaire. Voici les tarifs : 

- 500 kakeras pour 60 secondes
- 1000 kakeras pour 120 secondes
- 1500 kakeras pour 180 secondes
- 2000 kakeras pour 240 secondes
- 2500 kakeras pour 300 secondes

Lorsque la commande **/snipe** est effectuée, il faudra d'abord rentrer la valeur en kakeras que tu souhaites payer en fonction de la durée de l'exclusion que tu souhaites infliger. Voici les tarifs : 

- 600 kakeras pour une exclusion de 60 secondes
- 3000 kakeras pour une exclusion de 300 secondes
- 5000 kakeras pour une exclusion de 600 secondes
- 8500 kakeras pour une exclusion de 3600 secondes
- 25000 kakeras pour une exclusion de 86400 secondes

**Attention** : tenter un paiement de n'importe quelle autre valeur que celles affichées ci-dessus entraînera une annulation de la transaction.`;

      await interaction.reply(infoMessage);
    }
  },
};
