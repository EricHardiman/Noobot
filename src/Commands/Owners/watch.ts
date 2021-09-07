import { Command } from '../../Interfaces';
import { OWNERS, IMDB_URL } from '../../config.json';

import axios from 'axios';
import { DeleteMessage } from '../../Helpers';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
  name: 'watch',
  description: 'Search calmx for movie.',
  run: async (_client, message, args) => {
    if (!OWNERS.includes(message.author.id)) return;
    const imdbSearch = args.join('');

    const { roomId, Title, Poster } = await axios
      .get(`${IMDB_URL}${imdbSearch}`)
      .then(({ data }) => data)
      .catch(
        async () =>
          await message.channel
            .send("Can't find requested link")
            .then((message) => DeleteMessage({ message, timeout: 5000 })),
      );

    const embed = new MessageEmbed()
      .setAuthor('Now Playing:')
      .setTitle(Title)
      .setURL(`https://watch.tacoreel.app/${roomId}`)
      .setThumbnail(`https:${Poster}`)
      .setDescription('Click Here to Join!');

    return await message.channel.send({ embeds: [embed] });
  },
};
