import axios from 'axios';
import mongoose from 'mongoose';
import SpotifyLink from './Database/SpotifyLink';
import { SPOTIFY_ID } from './config.json';

const url = 'mongodb://localhost:27017/Noobot';

async function main() {
  await mongoose.connect(url);

  SpotifyLink.find().then((links) => {
    links.forEach(async ({ discordId, refresh_token }) => {
      try {
        const { data } = await axios.request({
          method: 'POST',
          url: 'https://accounts.spotify.com/api/token',
          params: {
            grant_type: 'refresh_token',
            refresh_token,
            SPOTIFY_ID,
          },
        });
        console.log(data);
      } catch {
        return console.log("Couldn't refresh token");
      }
    });
  });
}

main();
