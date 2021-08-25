import axios from 'axios';
import { ISpotifyLink } from '../../Database/SpotifyLink';
import { SpotifyTrack } from '../../global';

const GetCurrentPlayingTrack = async (spotifyLink: ISpotifyLink) => {
  const { access_token } = spotifyLink;

  const res = await axios.request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: access_token },
  });

  const { name, artists } = res.data as SpotifyTrack;

  return `${name} ${artists[0].name}`;
};

export default GetCurrentPlayingTrack;
