import { Player, Track } from 'discord-player';
import { GuildMember, Message } from 'discord.js';

const SongFromPresence = async ({
  args,
  player,
  message,
}: PresenceProps): Promise<{ song: Track; foundUser: GuildMember } | void> => {
  const taggedUser = args
    .join('')
    .match(/(?<=<@!)(.*)(?=\>)/g)
    ?.join('');

  const foundUser = message.guild?.members.cache.get(
    taggedUser ?? message.author.id,
  )!;

  const { presence } = foundUser;

  const userPresence = presence?.activities.find(
    (activity) => activity.name === 'Spotify',
  )!;

  if (!userPresence) return;

  const [song] = (
    await player.search(`${userPresence.details} ${userPresence.state}`, {
      requestedBy: message.author,
    })
  ).tracks;

  return { song, foundUser };
};

interface PresenceProps {
  player: Player;
  message: Message;
  args: any[];
}

export default SongFromPresence;
