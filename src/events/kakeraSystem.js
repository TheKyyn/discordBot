const { Permissions } = require("discord.js");
const { pendingDonations } = require("../database");
const { PermissionsBitField } = require("discord.js");
const { ChannelType } = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const giveCommandRegex = /^\$givek <@!?1106655523702575234> (\d+)$/;

    if (giveCommandRegex.test(message.content.toLowerCase())) {
      const amount = parseInt(message.content.match(giveCommandRegex)[1]);

      if (![2, 200, 400, 600, 800, 1000].includes(amount)) {
        message.reply(
          "Quantité invalide de kakeras. Les montants acceptés sont 2 (pour 30 secondes), 200, 400, 600, 800, et 1000 kakeras, correspondant respectivement à 30 secondes, 1, 2, 3, 4 et 5 minutes."
        );
        return;
      }

      const duration = calculateDuration(amount);

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
        donation.duration * 1000
      ).then((channel) => {
        if (channel) {
          message.channel.send(
            `Transaction acceptée. Ton salon ${channel.name} est disponible pendant ${donation.duration} secondes.`
          );
        } else {
          message.channel.send("Erreur : Impossible de créer le salon.");
        }
      });
      pendingDonations.delete(message.author.id);
    } else if (
      message.content.toLowerCase() !== "o" &&
      pendingDonations.has(message.author.id)
    ) {
      pendingDonations.delete(message.author.id);
    }
  },
};

function calculateDuration(amount) {
  if (amount === 2) {
    return 30;
  }
  return amount / 200;
}

async function createTemporaryChannel(guild, userId, duration) {
  const uniqueId = Date.now();
  const channelName = `privateroom-${uniqueId}`;

  if (!channelName || channelName.length > 100) {
    console.error("Erreur : le nom du salon est invalide ou trop long.");
    return null;
  }

  try {
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: userId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    setTimeout(async () => {
      if (channel) {
        await channel.delete();
      }
    }, duration);

    return channel;
  } catch (error) {
    console.error("Erreur lors de la création du salon :", error);
    return null;
  }
}
