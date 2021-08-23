import { Queue } from 'discord-player';
import { Message } from 'discord.js';

const JoinServer = async ({
  queue,
  message,
}: JoinServerProps): Promise<void> => {
  try {
    if (!queue.connection) await queue.connect(message.member?.voice.channel!);
  } catch {
    queue.destroy();
  }
};

interface JoinServerProps {
  queue: Queue;
  message: Message;
}

export default JoinServer;
