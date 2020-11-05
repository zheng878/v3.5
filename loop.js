const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop', //重複播放目前的歌曲
      group: 'music',
      aliases: ['lp'],
      memberName: 'loop',
      guildOnly: true,
      description: 'Loop the current playing song'
    });
  }

  run(message) {
    if (!message.guild.musicData.isPlaying) {
      return message.say('目前沒有播放中的歌曲!');
    } else if (
      message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
    ) {
      return message.say('You cannot loop over a trivia!');
    }

    message.channel.send(
      `${message.guild.musicData.nowPlaying.title} added to queue`
    );
    message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    return;
  }
};
