
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const key = require("../../config.json")
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const geniusLyricsAPI = require("../../tools/random.js").random([key.key, key.key2])

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics', //搜尋歌詞
      memberName: 'lyrics',
      aliases: ["l"],
      description:
        'Get lyrics of any song or the lyrics of the currently playing song',
      group: 'music',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'songName',
          default: '',
          type: 'string',
          prompt: '您想要搜尋甚麼歌的歌詞?'
        }
      ]
    });
  }
  async run(message, { songName }) {
    if (
      songName == '' &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
    ) {
      songName = message.guild.musicData.nowPlaying.title;
    } else if (songName == '' && message.guild.triviaData.isTriviaRunning) {
      return message.say('Please try again after the trivia has ended');
    } else if (songName == '' && !message.guild.musicData.isPlaying) {
      return message.say(
        '目前沒有播放中的歌曲,請重試或者輸入您想要查詢的歌曲名稱'
      );
    }
    const sentMessage = await message.channel.send(
      '👀 正在搜尋歌詞 👀'
    );

    // get song id
    var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

    const headers = {
      Authorization: `Bearer ${geniusLyricsAPI}`
    };
    try {
      var body = await fetch(url, { headers });
      var result = await body.json();
      console.log(result)
      const songID = result.response.hits[0].result.id;

      // get lyrics
      url = `https://api.genius.com/songs/${songID}`;
      body = await fetch(url, { headers });
      result = await body.json();

      const song = result.response.song;

      let lyrics = await getLyrics(song.url);
      lyrics = lyrics.replace(/(\[.+\])/g, '');

      if (lyrics.length > 4095)
        return message.say('歌詞過長,無法發送');
      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.trim());
        return sentMessage.edit('', lyricsEmbed);
      } else {
        // lyrics.length > 2048
        const firstLyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.slice(0, 2048));
        const secondLyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.slice(2048, lyrics.length));
        sentMessage.edit('', firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      }
    } catch (e) {
      console.error(e);
      return sentMessage.edit(
        '發生錯誤,請重試一次,或者輸入更具體一點的'
      );
    }
    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $('.lyrics')
        .text()
        .trim();
    }
  }
};