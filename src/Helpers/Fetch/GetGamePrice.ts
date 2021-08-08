import { anyDealToken } from '../../config.json';
import { AnyDealGame } from '../../global';
import axios from 'axios';

const GetGamePrice = async (plainTitle: string): Promise<AnyDealGame[]> => {
  const url = `https://api.isthereanydeal.com/v01/game/prices/?key=${anyDealToken}&plains=${plainTitle}`;
  const returnedPrices: AnyDealGame[] = await axios
    .get(url)
    .then((resp) => resp.data)
    .then(({ data }) => data[`${plainTitle}`]['list']);

  return returnedPrices.slice(0, 5);
};
export default GetGamePrice;
