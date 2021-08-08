import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'roll',
  description: 'Rolls 1-100 dice, defaults to 2."',
  run: async (_client, message, args) => {
    const [argRolls] = args;
    let numOfRolls = 2;
    let results = '';

    if (parseInt(argRolls) && parseInt(argRolls) <= 100) {
      numOfRolls = parseInt(argRolls);
    }

    for (let i = 0; i < numOfRolls; i++) {
      results = results + Math.floor(Math.random() * 6 + 1) + ', ';
    }

    message.channel.send(
      `<@${message.author.id}> you rolled **${results.slice(0, -2)}**.`,
    );
  },
};
