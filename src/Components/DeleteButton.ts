import { MessageActionRow, MessageButton } from 'discord.js';

const DeleteButton: MessageActionRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(`delete`)
    .setStyle('DANGER')
    .setLabel(`Close`),
);

export default DeleteButton;
