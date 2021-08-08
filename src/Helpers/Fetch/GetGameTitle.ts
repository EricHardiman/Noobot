import { anyDealToken } from '../../config.json';
import { AnyDealGame } from '../../global';
import axios from 'axios';

const GetGameTitle = async (gameTitle: string): Promise<AnyDealGame[]> => {
  const DLCFilter = ['DLC', 'Bundle', 'Pack'];
  const url = `https://api.isthereanydeal.com/v01/search/search/?key=${anyDealToken}&q=${gameTitle}`;

  const searchingForDLC = DLCFilter.some((word) =>
    gameTitle.toLowerCase().includes(word.toLowerCase()),
  );

  const returnedGames: AnyDealGame[] = await axios
    .get(url)
    .then((resp) => resp.data)
    .then(({ data: { list } }) => list);

  if (searchingForDLC) return returnedGames.slice(0, 5);

  const filteredNoDLC = returnedGames.filter(
    ({ title }: { title: string }) =>
      !DLCFilter.some((word) => title.includes(word)),
  );

  return filteredNoDLC.slice(0, 5);
};

export default GetGameTitle;
