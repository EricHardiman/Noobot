import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'linkspotify',
  description:
    "Sends a DM with a link to Verify Spotify. This allows the mynp command to work even if you're playing a game.",
  run: async (_client, message) => {
    const secret = Math.random().toString(36).substr(2, 8);

    await message.author.send(
      `https://noobot.tacoreel.app/login?state=${secret}-${message.author.id}`,
    );
  },
};
