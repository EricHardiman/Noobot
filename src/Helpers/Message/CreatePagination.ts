import {
  EmbedField,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { DeleteButton } from '../../Components';

const CreatePagination = ({
  title,
  options,
  arrStart = 0,
  arrEnd = 5,
  currentPage = 1,
}: PaginationProps): PaginationReturn => {
  const pageTotal = Math.ceil(options.length / 5);
  const components = new MessageActionRow();
  const disableNext = arrEnd >= options.length;
  const disablePrev = arrStart === 0;

  components.addComponents(
    new MessageButton()
      .setCustomId(`prev-${arrStart}-${arrEnd}-${currentPage}`)
      .setStyle('SECONDARY')
      .setLabel('Previous')
      .setDisabled(disablePrev),
    DeleteButton,
    new MessageButton()
      .setCustomId(`next-${arrStart}-${arrEnd}-${currentPage}`)
      .setStyle('PRIMARY')
      .setLabel('Next')
      .setDisabled(disableNext),
  );

  const fields = [...options].slice(arrStart, arrEnd);
  const embeds = new MessageEmbed({
    fields,
    footer: { text: `Page ${currentPage} of ${pageTotal}` },
  });

  title && embeds.setAuthor(title);

  return { embeds, components, arrStart, arrEnd, currentPage };
};
export default CreatePagination;

export interface PaginationProps {
  arrStart?: number;
  arrEnd?: number;
  currentPage?: number;
  options: EmbedField[];
  title?: string;
}

interface PaginationReturn {
  embeds: MessageEmbed;
  components: MessageActionRow;
  arrStart: number;
  arrEnd: number;
  currentPage: number;
}
