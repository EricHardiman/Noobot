import Queue from '../../Database/Queue';
import { Message } from 'discord.js';
import { FindCreateQueue } from '.';
import { Manager } from 'lavacord';
import { VolcanoTrack } from '../../global';
import { RetrievePlayer } from '..';

const PlayNext = async ({
  message,
  manager,
}: PlayNextProps): Promise<VolcanoTrack | undefined> => {
  const queue = await FindCreateQueue(message.guildId!);

  if (queue.tracks.length >= 1) {
    const [upNext, ...tracks] = queue.tracks;
    await Queue.updateOne(
      { guildId: message.guildId! },
      { current: upNext, tracks },
    );

    return upNext;
  } else {
    const player = RetrievePlayer(manager, message)!;

    await Queue.updateOne(
      { guildId: message.guildId! },
      { current: undefined, tracks: [] },
    );
    await player.destroy();
    await manager.leave(message.guildId!);

    return;
  }
};

interface PlayNextProps {
  message: Message;
  manager: Manager;
}

export default PlayNext;
