const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: '跳',
      memberName: '跳', //跳到指定的歌曲
      group: 'music',
      description:
        'Skip to a specific song in the queue, provide the song number as an argument',
      guildOnly: true,
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          key: 'songNumber',
          prompt:
            'What is the number in queue of the song you want to skip to?, it needs to be greater than 1',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {

    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply('請輸入一個有效的歌曲號碼');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('加入一個語音頻道,並且再試一次');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('目前沒有播放中的歌曲!');
    }

    if (message.guild.musicData.queue < 1)
      return message.say('隊列裡面沒有任何歌曲!');

    message.guild.musicData.queue.splice(0, songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
