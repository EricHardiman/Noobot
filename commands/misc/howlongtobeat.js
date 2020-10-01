const Discord = require("discord.js");
const commando = require("discord.js-commando");
const hltb = require("howlongtobeat");

module.exports = class HowLongToBeatCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "howlongtobeat",
      group: "misc",
      aliases: ["hltb"],
      memberName: "howlongtobeat",
      description: "Searches how long to beat for game times",
      args: [
        {
          key: "game",
          prompt: "What game to search",
          type: "string",
        },
      ],
    });
  }

  async run(message, { game }) {
    const hltbService = new hltb.HowLongToBeatService();

    const [result] = await hltbService.search(game);

    if (!result) {
      await message.reply(`Unable to find game`);
      return;
    }

    const labels = result.timeLabels;

    const embedData = {
      title: result.name,
      color: 53380,
      thumbnail: {
        url: result.imageUrl,
      },
    };

    const embed = new Discord.RichEmbed(embedData);
    console.log(labels);
    for (const [key, phrase] of labels) {
      if (result[key] > 0) {
        embed.addField(phrase, `${result[key]} hours`, true);
      }
    }
    await message.channel.send(embed);
  }
};
