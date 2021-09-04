import { Message } from 'discord.js';
import { Manager, Player } from 'lavacord';

const RetrievePlayer = (
  manager: Manager,
  message: Message,
): Player | undefined => {
  const player = manager.players.get(message.guildId!);

  return player;
};

export default RetrievePlayer;
