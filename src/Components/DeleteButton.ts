import { MessageActionRow, MessageButton } from 'discord.js';

const DeleteButton: MessageButton = new MessageButton()
  .setCustomId(`delete`)
  .setStyle('DANGER')
  .setLabel(`Close`);

export default DeleteButton;
