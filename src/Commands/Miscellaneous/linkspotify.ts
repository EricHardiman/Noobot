import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import LinkSpotifyCollector from '../../Collectors/LinkSpotify';
import SpotifyLink from '../../Database/SpotifyLink';
import { DeleteMessage } from '../../Helpers';
import { Command } from '../../Interfaces';

const handleActionRow = (
  buttonsDisabled: boolean,
): ActionRowBuilder<ButtonBuilder> =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger)
      .setCustomId('cancel')
      .setDisabled(buttonsDisabled),
    new ButtonBuilder()
      .setLabel('Finished')
      .setStyle(ButtonStyle.Success)
      .setCustomId('finished')
      .setDisabled(buttonsDisabled),
  );

export const command: Command = {
  name: 'linkspotify',
  description:
    "Sends a DM with a link to Verify Spotify. This allows the mynp command to work even if you're playing a game.",
  run: async (_client, message) => {
    await DeleteMessage({ message });
    const secret = Math.random().toString(36).substr(2, 8);
    const discordId = message.author.id;

    const newLink = new SpotifyLink({
      discordId,
      state: secret,
      access_token: 'new',
      refresh_token: 'new',
    });

    const { state, access_token, refresh_token } = newLink;

    await SpotifyLink.findOne({
      discordId,
    }).then(async (prev) => {
      if (prev) {
        await SpotifyLink.updateOne(
          { discordId },
          { state, access_token, refresh_token },
        );

        return prev;
      }

      return await SpotifyLink.create(newLink);
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Link Spotify to Noobot' })
      .setTitle('Click Here')
      .setURL(
        `https://garbanzo.tacoreel.app/login?state=${secret}-${discordId}`,
      )
      .setDescription(
        'After you click the URL above, come back to this message and click Finished',
      )
      .setFooter({ text: 'This will be deleted after 30 seconds.' });

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
          }),
        );
    }, 5000);

    return;
  },
};
