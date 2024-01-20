const { pendingDonations } = require("../database");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith("$give monbot")) {
      const amount = parseInt(message.content.split(" ")[3]);

      // verif du montant
      if (![200, 400, 600, 800, 1000].includes(amount)) {
        message.reply(
          "Quantité invalide de kakeras. Les montants acceptés sont 200, 400, 600, 800, et 1000 kakeras, correspondant respectivement à 1, 2, 3, 4 et 5 minutes."
        );
        return;
      }

      // durée du salon temp
      const duration = calculateDuration(amount);

      // register la demande
      pendingDonations.set(message.author.id, {
        amount,
        duration,
        channelId: message.channel.id,
      });
    } else if (
      message.content.toLowerCase() === "o" &&
      pendingDonations.has(message.author.id)
    ) {
      const donation = pendingDonations.get(message.author.id);
      createTemporaryChannel(
        message.guild,
        message.author.id,
        donation.duration * 60 * 1000
      ).then((channel) => {
        message.channel.send(
          `Transaction acceptée. Ton salon ${channel.name} est disponible pendant ${donation.duration} minutes.`
        );
      });
      pendingDonations.delete(message.author.id);
    }
  },
};

function calculateDuration(amount) {
  return amount / 200;
}

async function createTemporaryChannel(guild, userId, duration) {
  const channelName = `${userId}-private-room-${duration / 60}`;
  const channel = await guild.channels.create(channelName, {
    type: "GUILD_TEXT",
    permissionOverwrites: [
      {
        id: userId,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      },
      {
        id: guild.id,
        deny: ["VIEW_CHANNEL"],
      },
    ],
  });

  setTimeout(async () => {
    await channel.delete();
  }, duration);

  return channel;
}
