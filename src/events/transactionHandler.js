const { PermissionsBitField, ChannelType } = require("discord.js");
const { pendingTransactions } = require("../database");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const giveCommandRegex = /^\$givek <@!?1106655523702575234> (\d+)$/;
    const userTransaction = pendingTransactions.get(message.author.id);

    if (message.content.toLowerCase() === "o" && userTransaction) {
      const { type, amount, duration, channelId } = userTransaction;

      const kakerasAmount = message.content.match(giveCommandRegex)?.[1];
      if (!kakerasAmount || parseInt(kakerasAmount) !== amount) {
        message.reply(
          "Quantité de kakeras incorrecte pour la transaction demandée."
        );
        pendingTransactions.delete(message.author.id);
        return;
      }

      if (type === "salon") {
        createTemporaryChannel(
          message.guild,
          message.author.id,
          duration,
          message.channel
        );
      } else if (type === "snipe") {
        handleSnipe(message, duration);
      }
      pendingTransactions.delete(message.author.id);
    }
  },
};

async function createTemporaryChannel(guild, userId, duration, replyChannel) {
  const channelName = `privateroom-${userId}`;

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

    replyChannel.send(
      `Un salon temporaire "${channelName}" a été créé pour ${duration} secondes.`
    );
    setTimeout(async () => {
      if (channel.deletable) {
        await channel.delete();
      }
    }, duration * 1000);

    return channel;
  } catch (error) {
    console.error("Erreur lors de la création du salon :", error);
    return null;
  }
}

function handleSnipe(message, duration) {
  message.channel.send("Quel joueur souhaites-tu abattre ?").then(() => {
    const filter = (m) => m.author.id === message.author.id;
    message.channel
      .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
      .then((collected) => {
        const targetUser = collected.first().mentions.users.first();
        if (targetUser) {
          message.guild.members
            .fetch(targetUser.id)
            .then((member) => {
              member
                .timeout(duration * 1000, "Sniped")
                .then(() => {
                  message.channel.send(`Comme si c'était fait. Touché.`);
                })
                .catch((error) => {
                  message.channel.send(
                    `Erreur lors du snipe : ${error.message}`
                  );
                });
            })
            .catch(() => {
              message.channel.send(
                "Impossible de trouver cet utilisateur dans la guilde."
              );
            });
        } else {
          message.channel.send("Aucun joueur ciblé. Annulation du snipe.");
        }
      })
      .catch(() => {
        message.channel.send("Temps écoulé. Transaction annulée.");
      });
  });
}
