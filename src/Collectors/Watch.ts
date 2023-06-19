import {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { DeleteMessage } from '../Helpers';
import { WATCH_SECRET } from '../config.json';
import jwt from 'jsonwebtoken';

const WatchCollector = ({
  sentMessage,
  originalMessage,
  Title,
  Poster,
  roomId,
  Plot,
}: WatchProps) => {
  const collector = sentMessage.channel.createMessageComponentCollector({
    time: 300000,
  });

  collector.on('collect', async (i) => {
    const isRequester = i.user.id === originalMessage.author.id;
    const { customId } = i;

    if (customId === 'invite') {
      const { id, username } = i.user;
      const token = jwt.sign({ id, username }, WATCH_SECRET);
      const url = `https://watch.tacoreel.app/${roomId}?token=${token}`;

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(`Watch ${Title}`)
          .setURL(url),
      );

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Come Watch Together!' })
        .setTitle(Title)
        .setThumbnail(`https:${Poster}`)
        .setURL(url)
        .setDescription(Plot)
        .setFooter({ text: 'Click Link to or Button Join!' });

      return await i.user
        .send({ embeds: [embed], components: [buttonRow] })
        .then((message) => DeleteMessage({ message, timeout: 60000 }));
    }

    if (customId === 'delete-watch') {
      if (isRequester) {
        return await DeleteMessage({ message: sentMessage });
      } else {
        return await originalMessage.channel
          .send(`Only ${originalMessage.author.username} can delete this.`)
          .then((message) => DeleteMessage({ message, timeout: 3000 }));
      }
    }
  });

  collector.on('end', async (_collection, reason) => {
    if (reason === 'stop') {
      return await DeleteMessage({ message: sentMessage });
    }

    return await DeleteMessage({
      messages: [originalMessage, sentMessage],
    });
  });
};

interface WatchProps {
  sentMessage: Message;
  originalMessage: Message;
  roomId: string;
  Title: string;
  Poster: string;
  Plot: string;
}

export default WatchCollector;
