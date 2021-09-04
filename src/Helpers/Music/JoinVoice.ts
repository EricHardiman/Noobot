import { Message } from 'discord.js';
import { Manager, Player } from 'lavacord';

const JoinVoice = async (
  manager: Manager,
  message: Message,
): Promise<Player> => {
  const player = await manager.join({
    guild: message.guildId!,
    channel: message.member?.voice.channelId!,
    node: manager.idealNodes[0].id,
  });

  return player;
};

export default JoinVoice;
