import Client from '../Client';
import { ClientEvents } from 'discord.js';

interface Run {
  (client: Client, ...args: any[]): void;
}

export interface Event {
  name: keyof ClientEvents;
  run: Run;
}
