const {
  PermissionsBitField,
  ChannelType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { marketList } = require("../database");

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
  25000: 86400, // 24 heures
};

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

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
      case "market":
        await handleMarketCommand(interaction, interaction.user.id);
        break;
      case "showmarket":
        await handleShowMarketCommand(interaction);
        break;
      case "removemarket":
        await handleRemoveMarketCommand(interaction);
        break;
      default:
        interaction.reply("Commande non reconnue.");
    }
  },
};

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

async function handleMarketCommand(interaction, userId) {
  const characterName = interaction.options.getString("character");
  const preferredExchange =
    interaction.options.getString("exchange") || "Aucune préférence spécifique";

  if (!marketList.has(userId)) {
    marketList.set(userId, []);
  }

  if (marketList.get(userId).length >= 15) {
    interaction.reply(
      "Tu as déjà 15 personnages sur le marché. Trade un personnage ou enlève-le du marché pour en ajouter un nouveau."
    );
    return;
  }

  marketList.get(userId).push({
    characterName,
    preferredExchange,
    userName: interaction.user.username,
  });
  interaction.reply(
    `"${characterName}" a été ajouté au marché avec la préférence d'échange : "${preferredExchange}".`
  );
}

async function handleShowMarketCommand(interaction) {
  let marketMessage = "🛒 **Marché actuel**\n";
  marketList.forEach((userList, userId) => {
    userList.forEach((item) => {
      marketMessage += `**${item.userName}** - ${item.characterName} => ${item.preferredExchange}\n`;
    });
  });

  if (marketMessage === "🛒 **Marché actuel**\n") {
    marketMessage = "Le marché est actuellement vide.";
  }

  await interaction.reply(marketMessage);
}

async function handleRemoveMarketCommand(interaction) {
  const characterName = interaction.options.getString("character");
  const userId = interaction.user.id;

  if (
    !marketList.has(userId) ||
    !marketList.get(userId).find((char) => char.characterName === characterName)
  ) {
    await interaction.reply(
      `"${characterName}" n'est pas sur le marché ou ne t'appartient pas.`
    );
    return;
  }

  marketList.set(
    userId,
    marketList
      .get(userId)
      .filter((char) => char.characterName !== characterName)
  );
  await interaction.reply(`"${characterName}" a été retiré du marché.`);
}

function calculateDuration(type, amount) {
  return type === "salon" ? salonDurations[amount] : snipeDurations[amount];
}

async function handleInfoCommand(interaction) {
  const infoMessage = `
  **Récapitulatif** : 

  Lorsque la commande **/salon** est effectuée, il faudra d'abord rentrer la valeur en kakeras que tu souhaites payer en fonction de la durée que tu souhaites attribuer à ton salon temporaire. Voici les tarifs : 

  - 500 kakeras pour 60 secondes
  - 1000 kakeras pour 2 minutes
  - 1500 kakeras pour 3 minutes
  - 2000 kakeras pour 4 minutes
  - 2500 kakeras pour 5 minutes

  Lorsque la commande **/snipe** est effectuée, il faudra d'abord rentrer la valeur en kakeras que tu souhaites payer en fonction de la durée de l'exclusion que tu souhaites infliger. Voici les tarifs : 

  - 600 kakeras pour une exclusion de 60 secondes
  - 3000 kakeras pour une exclusion de 5 minutes
  - 5000 kakeras pour une exclusion de 10 minutes
  - 8500 kakeras pour une exclusion de 1 heure
  - 25000 kakeras pour une exclusion de 24 heures

  **Attention** : tenter un paiement de n'importe quelle autre valeur que celles affichées ci-dessus entraînera une annulation de la transaction.
  
  Commandes liées au marché :
  
  - **/market** : permet d'ajouter un personnage que tu souhaites trade. Tu peux spécifier un personnage ou une série en particulier que tu souhaiterais idéalement échanger, ou ne rien spécifier.
  - **/showmarket** : permet d'afficher le marché. Le personnage à gauche est celui disponible au trade, et à droite se trouve le personnage ou la série désirée en échange, s'il y en a une.
  - **/removemarket** : permet de retirer un personnage du marché, seulement s'il t'appartient.
  
  15 personnages maximum par personne sur le marché, pour l'instant.`;

  await interaction.reply(infoMessage);
}
