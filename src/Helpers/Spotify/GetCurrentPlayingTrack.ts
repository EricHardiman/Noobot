import axios from 'axios';
import { ISpotifyLink } from '../../Database/SpotifyLink';
import { SpotifyTrack } from '../../global';

const GetCurrentPlayingTrack = async (spotifyLink: ISpotifyLink) => {
  const { access_token } = spotifyLink;

  const {
    data: { item },
  } = await axios.request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const { name, artists } = item as SpotifyTrack;

  const artistNames = artists.map((artist) => artist.name).join(', ');

  return `${name} ${artistNames}`;
};

export default GetCurrentPlayingTrack;
