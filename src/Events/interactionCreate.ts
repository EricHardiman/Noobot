import { Interaction } from 'discord.js';
import DiscordClient from '../Client';
import { Event } from '../Interfaces';

export const event: Event = {
  name: 'interactionCreate',
  run: (_client: DiscordClient, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
      case 'delete':
        interaction.channel?.messages.delete(interaction.message.id);
        break;

      default:
        break;
    }
  },
};
