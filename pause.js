const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause', //暫停播放
      aliases: ['pause-song', 'hold', 'stop', 'stfu'],
      memberName: 'pause',
      group: 'music',
      description: 'Pause the current playing song',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('請加入一個語音頻道,並且重新嘗試一次');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.say('目前沒有正在播放的歌曲!');
    }

    message.say('暫停 :pause_button:');

    message.guild.musicData.songDispatcher.pause();
  }
};
