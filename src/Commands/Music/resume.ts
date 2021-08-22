import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'resume',
  description: 'Resumes whatever was playing.',
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);

    if (queue && queue.connection.paused) {
      queue.setPaused(false);
      return message.channel.send(`Resuming \`${queue.current.title}\`.`);
    }
  },
};
