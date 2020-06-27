const Discord = require("discord.js")
const commando = require("discord.js-commando");
const hltb = require('howlongtobeat');

module.exports = class HowLongToBeatCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "howlongtobeat",
      group: "misc",
      aliases: ['hltb'],
      memberName: "howlongtobeat",
      description: "Searches how long to beat for game times",
      args: [
        {
          key: 'game',
          prompt: 'What game to search',
          type: 'string'
        }
      ]
    });
  }

  async run(message, {game}) {
    const hltbService = new hltb.HowLongToBeatService();

    const [result] = await hltbService.search(game)

    if (!result) {
      await message.reply(`Unable to find game`)
      return
    }

    const [main, extra, completionist] = result.timeLabels
    let embedData = {
      "title": result.name,
      "color": 53380,
      "thumbnail": {
        url: result.imageUrl
      },
      "fields": [
        {
          name: main[1],
          value: `${result.gameplayMain.toString()} hours`,
          inline: true
        },
        {
          name: extra[1],
          value: `${result.gameplayMainExtra.toString()} hours`,
          inline: true
        },
        {
          name: completionist[1],
          value: `${result.gameplayCompletionist.toString()} hours`,
          inline: true
        }
      ]
    }
    const embed = new Discord.RichEmbed(embedData)
    await message.channel.send(embed)
  }
};
