import axios from 'axios';
import { ISpotifyLink } from '../../Database/SpotifyLink';

const GetSpotifyUser = async (spotifyLink: ISpotifyLink) => {
  const { access_token } = spotifyLink;

  const { data } = await axios.request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: access_token },
  });

  console.log(data);
};

export default GetSpotifyUser;
