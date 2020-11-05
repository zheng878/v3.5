const { Command } = require('discord.js-commando');
// name = 指令
// name: '指令名稱uwu'
module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves voice channel if in on' //讓機器人退出目前語音頻道
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('請加入一個語音頻道並且再試一次');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('目前沒有正在播放的歌曲!');
    }
    if (!message.guild.musicData.queue)
      return message.say('隊列裡面沒有歌曲!');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0;
    return;
  }
};