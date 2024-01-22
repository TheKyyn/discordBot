const { Permissions } = require("discord.js");
const { pendingDonations } = require("../database");
const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const giveCommandRegex = /^\$givek <@!?1106655523702575234> (\d+)$/;
    const filter = (m) => m.author.id === message.author.id;

    if (giveCommandRegex.test(message.content.toLowerCase())) {
      const amount = parseInt(message.content.match(giveCommandRegex)[1]);
      if (![2, 200, 400, 600, 800, 1000].includes(amount)) {
        message.reply("Quantité invalide de kakeras...");
        return;
      }

      const duration = calculateDuration(amount);
      pendingDonations.set(message.author.id, {
        amount,
        duration,
        channelId: message.channel.id,
        actionType: null,
      });
    } else if (
      message.content.toLowerCase() === "o" &&
      pendingDonations.has(message.author.id)
    ) {
      const donation = pendingDonations.get(message.author.id);

      message
        .reply(
          "Souhaites-tu un salon personnalisé ou des rolls ? (**salon** / **rolls**)"
        )
        .then(() => {
          message.channel
            .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
            .then((collected) => {
              const response = collected.first().content.toLowerCase();

              if (response === "salon") {
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
                    message.channel.send(
                      "Erreur : Impossible de créer le salon."
                    );
                  }
                });
              } else if (response === "rolls") {
                handleRolls(message, filter);
              } else {
                message.channel.send(
                  "Réponse non reconnue. Annulation de la transaction."
                );
              }

              pendingDonations.delete(message.author.id);
            })
            .catch(() => {
              message.channel.send("Temps écoulé. Transaction annulée.");
              pendingDonations.delete(message.author.id);
            });
        });
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
  const channelName = `privateroom`;

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

function handleRolls(message, filter) {
  message.channel
    .send("Choisis le type de message : $ha, wa, ou $ma")
    .then(() => {
      message.channel
        .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
        .then((collected) => {
          const rollType = collected.first().content.toLowerCase();
          if (["$ha", "wa", "$ma"].includes(rollType)) {
            for (let i = 0; i < 10; i++) {
              setTimeout(() => {
                message.channel.send(rollType);
              }, 2000 * i);
            }
          } else {
            message.channel.send(
              "Type de message non reconnu. Annulation de la transaction."
            );
          }
        })
        .catch(() => {
          message.channel.send("Temps écoulé. Transaction annulée.");
        });
    });
}
