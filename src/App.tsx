import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import GifService from "./GifService";

const COLUMNS = 4;

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

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollObserver.unobserve(entry.target)
        searchGifs(search, gifs.length);
      }
    });
  });

  const searchGifs = useMemo(
    () =>
      debounce((query: string, offset: number = 0) => {
        if (query == "") return;
        setIsLoading(true);
        gifService
          .fetchGifs(query, offset)
          .then((res) => {
            if (offset == 0) setGifs(res.gifs);
            else setGifs([...gifs, ...res.gifs]);
          })
          .catch((error) => alert(error))
          .finally(() => setIsLoading(false));
      }, 500),
    []
  );

  function handleSearch(e: any) {
    setSearch(e.target.value);
    searchGifs(e.target.value);
  }

  function columnizeGifs(
    gifs: GifProps[],
    cols: number = COLUMNS
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
            {col.map((gif, j) => (
              <Gif key={j} {...gif} />
            ))}
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="loading">
          <span style={{ animationDelay: "0s" }}></span>
          <span style={{ animationDelay: "0.2s" }}></span>
          <span style={{ animationDelay: "0.4s" }}></span>
          <span style={{ animationDelay: "0.6s" }}></span>
          <span style={{ animationDelay: "0.8s" }}></span>
          <span style={{ animationDelay: "1s" }}></span>
        </div>
      )}
    </>
  );
}
