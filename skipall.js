const { Command } = require('discord.js-commando');

module.exports = class SkipAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipall', //跳過所有歌曲
      aliases: ['skip-all'],
      memberName: 'skipall',
      group: 'music',
      description: 'Skip all songs in queue',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR']
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('目前沒有播放中的歌曲!');
    }
    if (!message.guild.musicData.queue)
      return message.say('隊列裡面沒有歌曲!');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0; // clear queue
    return;
  }
};
