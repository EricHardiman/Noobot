export interface AnyDealGame {
  plain: string;
  title: string;
  price_new: number;
  price_old: number;
  price_cut: number;
  shop: {
    id: string;
    name: string;
  };
  url: string;
  urls: {
    buy: string;
    game: string;
  };
}
