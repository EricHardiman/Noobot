import axios from 'axios';
import { Manager } from 'lavacord';
import { VolcanoTrack } from '../../global';

const SongSearch = async ({
  manager,
  search,
}: {
  manager: Manager;
  search: string;
}): Promise<SongSearchReturn> => {
  const [node] = manager.idealNodes;
  const ytRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/g;
  const isYoutubeUrl = ytRegex.test(search);
  const playlist = isYoutubeUrl && search.includes('list=');

  const params = new URLSearchParams();
  params.append('identifier', isYoutubeUrl ? search : `ytsearch:${search}`);

  const tracks = await axios
    .get(`http://${node.host}:${node.port}/loadtracks?${params}`, {
      headers: { Authorization: node.password },
    })
    .then(({ data }) => data.tracks as VolcanoTrack[]);

  return { tracks, playlist };
};
interface SongSearchReturn {
  tracks: VolcanoTrack[];
  playlist: boolean;
}

export default SongSearch;
