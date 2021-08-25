import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import mongoose from "mongoose";
import LinkSpotifyCollector from "../../Collectors/LinkSpotify";
import SpotifyLink from "../../Database/SpotifyLink";
import { MessageHelpers } from "../../Helpers";
import { Command } from "../../Interfaces";

const handleActionRow = (buttonsDisabled: boolean): MessageActionRow =>
  new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Cancel")
      .setStyle("DANGER")
      .setCustomId("cancel")
      .setDisabled(buttonsDisabled),
    new MessageButton()
      .setLabel("Finished")
      .setStyle("SUCCESS")
      .setCustomId("finished")
      .setDisabled(buttonsDisabled)
  );

const url = "mongodb://localhost:27017/Noobot";

export const command: Command = {
  name: "linkspotify",
  description:
    "Sends a DM with a link to Verify Spotify. This allows the mynp command to work even if you're playing a game.",
  run: async (_client, message) => {
    await MessageHelpers.DeleteMessage({ message });
    const secret = Math.random().toString(36).substr(2, 8);
    const discordId = message.author.id;

    await mongoose.connect(url);

    const newLink = new SpotifyLink({
      discordId,
      state: secret,
      access_token: "",
      refresh_token: "",
    });

    const { state, access_token, refresh_token } = newLink;

    await SpotifyLink.findOne({
      discordId,
    }).then(async (prev) => {
      if (prev) {
        await SpotifyLink.updateOne(
          { discordId },
          { state, access_token, refresh_token }
        );

        return prev;
      }

      return await SpotifyLink.create(newLink);
    });

    const embed = new MessageEmbed()
      .setAuthor("Link Spotify to Noobot")
      .setTitle("Click Here")
      .setURL(`https://noobot.tacoreel.app/login?state=${secret}-${discordId}`)
      .setDescription(
        "After you click the URL above, come back to this message and click Finished"
      )
      .setFooter("This will be deleted after 30 seconds.");

    const disabledButtonsMessage = await message.author.send({
      embeds: [embed],
      components: [handleActionRow(true)],
    });

    setTimeout(async () => {
      await disabledButtonsMessage
        .edit({
          components: [handleActionRow(false)],
        })
        .then((sentMessage) =>
          LinkSpotifyCollector({
            sentMessage,
            originalMessage: message,
            secret,
          })
        );
    }, 5000);
  },
};
