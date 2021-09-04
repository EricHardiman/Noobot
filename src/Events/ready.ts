import DiscordClient from '../Client';
import { Event } from '../Interfaces';

export const event: Event = {
  name: 'ready',
  run: async (client: DiscordClient) => {
    console.log(`${client.user?.tag} is online!`);

    await client.initVolcano(client);
    console.log('Connected to Volcano!');
  },
};
