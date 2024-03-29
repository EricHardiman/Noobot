import axios from 'axios';
import { Message, EmbedBuilder } from 'discord.js';
import SpotifyLink from '../Database/SpotifyLink';
import { DeleteMessage } from '../Helpers';

const LinkSpotifyCollector = ({
  sentMessage,
  originalMessage,
  secret,
}: LinkSpotifyProps) => {
  const collector = sentMessage.channel.createMessageComponentCollector({
    time: 30000,
  });

  collector.on('collect', async (i) => {
    const { customId } = i;

    if (customId === 'cancel')
      return await DeleteMessage({ message: sentMessage });

    if (customId === 'finished') {
      await SpotifyLink.findOne({
        discordId: originalMessage.author.id,
        state: secret,
      }).then((found) => {
        if (found) {
          const { access_token } = found;
          axios
            .request({
              method: 'GET',
              url: 'https://api.spotify.com/v1/me',
              headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            })
            .then(async ({ data }) => {
              const {
                display_name,
                images,
                external_urls: { spotify },
              } = data;

              const embed = new EmbedBuilder()
                .setAuthor({
                  name: 'Successfully Linked!',
                  url: images.length
                    ? images[0].url
                    : 'https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png',
                })
                .setTitle(`${display_name} is now linked with Noobot!`)
                .setURL(spotify)
                .setColor('Blurple');

              await DeleteMessage({ message: sentMessage });
              await originalMessage.author.send({ embeds: [embed] });
            });
        }
      });

      return await DeleteMessage({ message: sentMessage });
    }

    return collector.stop();
  });

  collector.on('end', async (collection) => {
    if (![...collection.values()].length)
      return await DeleteMessage({
        message: sentMessage,
      });
  });
};

interface LinkSpotifyProps {
  sentMessage: Message;
  originalMessage: Message;
  secret: string;
}

export default LinkSpotifyCollector;
