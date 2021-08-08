import Client from '../Client';
import { Message } from 'discord.js';

interface Run {
  (client: Client, message: Message, args: string[]): void;
}

export interface Command {
  run: Run;
  name: string;
  description: string;
  aliases?: string[];
}
