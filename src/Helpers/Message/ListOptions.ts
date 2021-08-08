import { ColorResolvable, EmbedField, MessageEmbed } from 'discord.js';

const ListOptions = ({
  title,
  fields,
  color = 'AQUA',
}: ListOptionsProps): MessageEmbed => {
  const embed = new MessageEmbed({ title, color, fields });

  return embed;
};

interface ListOptionsProps {
  title?: string;
  fields: EmbedField[];
  color?: ColorResolvable;
}

export default ListOptions;
