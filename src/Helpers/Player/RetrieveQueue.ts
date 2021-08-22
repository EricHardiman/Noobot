import { Guild } from 'discord.js';
import { Player, Queue } from 'discord-player';

const RetrieveQueue = ({ guild, player }: RetrieveQueueProps): Queue => {
  return player.getQueue(guild.id) || player.createQueue(guild);
};

interface RetrieveQueueProps {
  guild: Guild;
  player: Player;
}

export default RetrieveQueue;
