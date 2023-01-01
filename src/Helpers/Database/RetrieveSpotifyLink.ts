import axios from 'axios';
import SpotifyLink from '../../Database/SpotifyLink';
import { SPOTIFY_ID, SPOTIFY_SECRET } from '../../config.json';

const RetrieveSpotifyLink = async (discordId: string) => {
  const spotifyLink = await SpotifyLink.findOne({ discordId });

  if (spotifyLink) {
    const { refresh_token } = spotifyLink;

    const { data } = await axios.request({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'refresh_token',
        refresh_token,
        redirect_uri: 'https://garbanzo.tacoreel.app/callback',
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

  return spotifyLink;
};

export default RetrieveSpotifyLink;
