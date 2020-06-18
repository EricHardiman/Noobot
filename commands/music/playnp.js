const commando = require("discord.js-commando");
const Discord = require("discord.js");
const helper = require("../../helpers");

module.exports = class MyNPCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "playnp",
      aliases: ["pnp"],
      group: "music",
      memberName: "playnp",
      description:
        "Retrieves the song the is currently listening to on Spotify and plays it.",
      args: [
        {
          key: "user",
          prompt: "Optional user to get now playing Spotify song.",
          type: "user",
          default: ""
        }
      ]
    });
  }

  async run(message, { user }) {
    await message.delete();

    let presence = {};
    if (message.member.voiceChannel) {
        if (user === "") {
            presence = message.member.presence;
        } else {
            const guildUser = await message.guild.member(user);
            presence = guildUser.presence;
        }
        const dbserver = await helper.retrieveServer(message.guild.id);
        let queue = await helper.retrieveQueue(dbserver.id);
        let waitingForReaction = false;
        if (!servers[message.guild.id]) {
          servers[message.guild.id] = {};
        }

        const game = presence.game;

        if (!game || game.name !== "Spotify") {
          return;
        }
    
        const result = await helper.lavalinkHelper(game.details + " " + game.state);
        
        if (!result) {
          const response = await message.reply(`There was an issue finding any results for: \`\`\`${game.details + " " + game.state}\`\`\`This is likely an issue with Lavalink. Try again in a few moments.`)
          await response.delete(5000)
          return
        }
    
        if (result.info) {
          const [song] = await helper.lavalinkForURLOnly(result.info.uri)
          helper.songQueueJoin(song, queue);
        }

        const awaitReaction = setInterval(() => {
            if (!waitingForReaction) {
              clearInterval(awaitReaction);
              helper.retrieveQueue(dbserver.id).then(queue => {
                const manager = this.client.manager;
                const data = {
                  guild: message.guild.id,
                  channel: message.member.voiceChannelID,
                  host: "localhost"
                };
    
                const botPlayingMusic = manager.spawnPlayer(data);
    
                if (
                  queue.songs.length > 0 &&
                  !botPlayingMusic.playing &&
                  !botPlayingMusic.paused
                ) {
                  manager.leave(message.guild.id);
                  const player = manager.join(data);
    
                  helper.play(player, message, manager);
                }
              });
            }
          }, 1000);
    }
    else {
     const reply = await message.reply(`You must be in a voice channel you dunce.`)
     await reply.delete(5000)
    }
  }
};
