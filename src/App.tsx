import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import GifService from "./GifService";

const DEFAULT_COLUMNS = 4;

export interface GifProps {
  copyUrl: string;
  displayUrl: string;
  height: number;
  width: number;
}

function Gif(props: GifProps) {
  return (
    <>
      <video
        className="gif"
        style={{ aspectRatio: `${props.width} / ${props.height}` }}
        autoPlay
        muted
        loop
        onClick={() => navigator.clipboard.writeText(props.copyUrl)}
      >
        <source src={props.displayUrl} type="video/mp4" />
      </video>
    </>
  );
}

export default function App() {
  const gifService = new GifService();

  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<GifProps[]>([]);
  const [columns, setColumns] = useState<GifProps[][]>(
    new Array<GifProps[]>(3).fill([])
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchGifs = useMemo(
    () =>
      debounce(
        (query: string) =>
          gifService
            .fetchGifs(query)
            .then((res) => setGifs(res))
            .catch((error) => alert(error)),
        500
      ),
    []
  );

  function handleSearch(e: any) {
    setSearch(e.target.value);
    searchGifs(e.target.value);
  }

  function columnizeGifs(
    gifs: GifProps[],
    cols: number = DEFAULT_COLUMNS
  ): GifProps[][] {
    let res = new Array<GifProps[]>(cols).fill(new Array<GifProps>());
    for (let i = 0; i < cols; i++) {
      res[i] = gifs.filter((gif, j) => j % cols == i);
    }
    return res;
  }

  useEffect(() => setColumns(columnizeGifs(gifs)), [gifs]);

  return (
    <>
      <input
        id="search"
        type="text"
        placeholder="Search for a GIF..."
        value={search}
        onChange={handleSearch}
      />
      <div className="results">
        {columns.map((col, i) => (
          <div className="column" key={i}>
            {col.map((gif) => (
              <Gif key={gif.copyUrl} {...gif} />
            ))}
          </div>
        ))}
      </div>
      {isLoading && 
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      }
    </>
  );
}
