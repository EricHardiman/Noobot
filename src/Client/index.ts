import path from 'path';
import { readdirSync } from 'fs';
import { Client, Intents, Collection } from 'discord.js';
import { token } from '../config.json';
import { Command, Config, Event } from '../Interfaces';
import config from '../config.json';

export default class DiscordClient extends Client {
  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
  }

  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public config: Config = config;

  public init() {
    this.login(token);

    const commandPath = path.join(__dirname, '..', 'Commands');
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((file) =>
        file.endsWith('ts'),
      );

      for (const file of commands) {
        const { command } = require(`${commandPath}/${dir}/${file}`);
        this.commands.set(command.name, command);

        if (command?.aliases) {
          command.aliases.forEach((alias: string) => {
            this.aliases.set(alias, command);
          });
        }
      }
    });

    const eventPath = path.join(__dirname, '..', 'Events');
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`);

      this.events.set(event.name, event);
      this.on(event.name, event.run.bind(null, this));
    });
  }
}
