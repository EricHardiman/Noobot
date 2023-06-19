import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Message } from 'discord.js';
import { DeleteMessage } from '../Helpers';
import { MovieObject } from '../Helpers/Message/CreateMovieNight';
import { TOKEN } from '../config.json';

const CreateMovieCollector = ({
  sentMessage,
  originalMessage,
  movieObject,
  userDate,
  userTime,
}: CreateMovieProps) => {
  const collector = sentMessage.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === originalMessage.author.id,
    time: 15000,
  });

  collector.on('collect', async (i) => {
    const [action] = i.customId.split('-');
    const { name, plot, casts, totalRunTime, titleYear, posterUrl } =
      movieObject;

    if (action === 'cancel') {
      await DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
    } else if (action === 'confirm') {
      let formattedTime;
      const amPm = userTime
        ?.match(/[A-Za-z]/g)
        ?.join('')
        .toLowerCase();
      const [hours, minutes] = userTime!.replace(/[^0-9:]+/g, '').split(':');

      if (amPm === 'pm' && parseInt(hours) < 12) {
        formattedTime = [parseInt(hours) + 12, minutes];
      } else if (amPm === 'am' && parseInt(hours) === 12) {
        formattedTime = [parseInt(hours) - 12, minutes];
      } else {
        formattedTime = [hours, minutes];
      }

      const [month, day, year] = userDate!.split('/');

      const isoTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        formattedTime[0],
        formattedTime[1],
      );
      dayjs.extend(utc);

      try {
        const {
          data: { guild_id, id },
        } = await axios({
          method: 'POST',
          url: `https://discord.com/api/v10/guilds/${originalMessage.guildId}/scheduled-events`,
          data: {
            name: `Movie Night: ${name} (${titleYear})`,
            privacy_level: 2,
            description: `We're watching ${name} on ${userDate}. \n\n${plot}\n\nStarring: ${casts}\n\nRuntime: ${totalRunTime}`,
            entity_type: 2,
            scheduled_start_time: dayjs.utc(isoTime).format(),
            channel_id: '92470252981460992',
          },
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bot ${TOKEN}`,
          },
        });

        await originalMessage.channel.send(
          `https://discord.com/events/${guild_id}/${id}`,
        );
      } catch {}
    }

    return collector.stop('stop');
  });

  collector.on('end', async (collection, reason) => {
    if (reason === 'stop') {
      return await DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
    }

    if (![...collection.values()].length)
      return await DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
  });
};

interface CreateMovieProps {
  sentMessage: Message;
  originalMessage: Message;
  movieObject: MovieObject;
  userDate?: string;
  userTime?: string;
}

export default CreateMovieCollector;
