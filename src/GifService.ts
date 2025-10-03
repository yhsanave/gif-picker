import { GifProps } from "./App";

const GIPHY_API_SEARCH_URL = "https://api.giphy.com/v1/gifs/search?";
const GIPHY_API_KEY = "W4lQmuX5pTahX4biD7WvfiCHmOKteBZl"; // GIPHY's API docs explicitly require that API calls be made from the client side which requires exposing the API key

export default class GifService {
  parseGif(gif: any): GifProps {
    return {
      copyUrl: gif.bitly_url,
      displayUrl: gif.images.fixed_width.mp4,
      width: gif.images.fixed_width.width,
      height: gif.images.fixed_width.height,
    };
  }

  async fetchGifs(
    query: string,
    limit: number = 25,
    offset: number = 0
  ): Promise<GifProps[]> {
    let params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      api_key: GIPHY_API_KEY,
    });
    let res = await fetch(GIPHY_API_SEARCH_URL + params);
    if (!res.ok) throw Error(`Error fetching GIFs: ${res.status}`);
    let body = await res.json();
    return body.data.map(this.parseGif);
  }
}
