import { ClientEvents,  } from 'discord.js';
import { DiscordPacket } from 'lavacord';
import DiscordClient from '../Client';
import { Event } from '../Interfaces';

export const event: Event = {
  name: 'raw' as keyof ClientEvents,
  run: async (client: DiscordClient, event: DiscordPacket) => {
    if (event.t === 'VOICE_STATE_UPDATE') {
      if (!client.manager) return;
      client.manager.voiceStateUpdate(event.d);
    } else if (event.t === 'VOICE_SERVER_UPDATE') {
      if (!client.manager) return;
      client.manager.voiceServerUpdate(event.d);
    }
  },
};
