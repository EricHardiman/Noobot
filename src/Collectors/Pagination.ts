import { ButtonInteraction, EmbedField, Message } from 'discord.js';
import { Player, Track } from 'discord-player';
import { MessageHelpers, MusicHelpers } from '../Helpers';

const PaginationCollector = ({
  sentMessage,
  originalMessage,
  options,
  title,
}: PaginationProps) => {
  const filter = (i: ButtonInteraction) =>
    i.user.id === originalMessage.author.id;

  const collector = sentMessage.channel.createMessageComponentCollector({
    filter,
    time: 20000,
  });

  collector.on('collect', async (i) => {
    const [direction, arrStart, arrEnd, currentPage] = i.customId.split('-');

    if (direction === 'delete') {
      await MessageHelpers.DeleteMessage({ message: originalMessage });
      return collector.stop('delete');
    }

    let newStart = parseInt(arrStart);
    let newEnd = parseInt(arrEnd);
    let newPage = parseInt(currentPage);

    switch (direction) {
      case 'next':
        newStart += 5;
        newEnd += 5;
        newPage += 1;
        break;

      case 'prev':
        newStart -= 5;
        newEnd -= 5;
        newPage -= 1;
        break;
    }

    const { embeds, components } = MessageHelpers.CreatePagination({
      options,
      arrStart: newStart,
      arrEnd: newEnd,
      currentPage: newPage,
      title,
    });

    collector.resetTimer();
    return await i.update({ embeds: [embeds], components: [components] });
  });

  collector.on('end', async (_, reason) => {
    if (reason === 'time') {
      await MessageHelpers.DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
    }
  });
};

interface PaginationProps {
  options: EmbedField[];
  sentMessage: Message;
  originalMessage: Message;
  title?: string;
}

export default PaginationCollector;
