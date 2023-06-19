import { ButtonBuilder, ButtonStyle } from 'discord.js';

const DeleteButton = new ButtonBuilder()
  .setCustomId(`delete`)
  .setStyle(ButtonStyle.Danger)
  .setLabel(`Close`);

export default DeleteButton;
