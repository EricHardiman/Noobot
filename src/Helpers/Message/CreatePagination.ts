import {
  EmbedField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
  const components = new ActionRowBuilder<ButtonBuilder>();
  const disableNext = arrEnd >= options.length;
  const disablePrev = arrStart === 0;

  components.addComponents(
    new ButtonBuilder()
      .setCustomId(`prev-${arrStart}-${arrEnd}-${currentPage}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel('Previous')
      .setDisabled(disablePrev),
    DeleteButton,
    new ButtonBuilder()
      .setCustomId(`next-${arrStart}-${arrEnd}-${currentPage}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Next')
      .setDisabled(disableNext),
  );

  const fields = [...options].slice(arrStart, arrEnd);
  const embeds = new EmbedBuilder({
    fields,
    footer: { text: `Page ${currentPage} of ${pageTotal}` },
  });

  title && embeds.setAuthor({ name: title });

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
  embeds: EmbedBuilder;
  components: ActionRowBuilder<ButtonBuilder>;
  arrStart: number;
  arrEnd: number;
  currentPage: number;
}
