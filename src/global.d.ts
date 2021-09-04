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

export interface SpotifyTrack {
  album: {
    album_type: string;
    name: string;
    release_date: string;
  };
  artists: Array<{
    name: string;
  }>;
  name: string;
}

export interface SpotifyAlbum {
  artists: Array<{
    name: string;
  }>;
  tracks: {
    items: SpotifyTrack[];
  };
  name: string;
}

export interface SpotifyPlaylist {
  tracks: {
    items: Array<{ track: SpotifyTrack }>;
  };
}

export interface VolcanoTrack {
  track: string;
  info: {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri: string;
  };
}
