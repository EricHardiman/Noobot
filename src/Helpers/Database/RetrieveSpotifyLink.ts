import axios from 'axios';
import Mongoose from 'mongoose';
import SpotifyLink from '../../Database/SpotifyLink';
import { MONGOOSE_URL, SPOTIFY_ID, SPOTIFY_SECRET } from '../../config.json';

const RetrieveSpotifyLink = async (discordId: string) => {
  const mongoose = await Mongoose.connect(MONGOOSE_URL);
  const spotifyLink = await SpotifyLink.findOne({ discordId });

  if (spotifyLink) {
    const { refresh_token } = spotifyLink;

    const { data } = await axios.request({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'refresh_token',
        refresh_token,
        redirect_uri: 'https://noobot.tacoreel.app/callback',
        client_id: SPOTIFY_ID,
        client_secret: SPOTIFY_SECRET,
      },
    });

    await SpotifyLink.updateOne(
      { discordId },
      { access_token: data.access_token },
    );
    spotifyLink.access_token = data.access_token;
  }

  mongoose.connection.close();

  return spotifyLink;
};

export default RetrieveSpotifyLink;
