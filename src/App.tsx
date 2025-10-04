import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import GifService from "./GifService";

const COLUMNS = 4;

export interface GifProps {
  copyUrl: string;
  displayUrl: string;
  height: number;
  width: number;
  copyCallback?: Function;
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
        onClick={() => {
          navigator.clipboard.writeText(props.copyUrl);
          if (props.copyCallback !== undefined) props.copyCallback();
        }}
      >
        <source src={props.displayUrl} type="video/mp4" />
      </video>
    </>
  );
}

type ToastType = "Info" | "Error";

interface ToastProps {
  message: string;
  type: ToastType;
}

function Toast(props: ToastProps) {
  return (
    <>
      <div
        className={`toast ${
          props.type == "Info" ? "toast-info" : "toast-error"
        }`}
      >
        <p>
          <span>{props.type == "Info" ? "ℹ️" : "⚠️"} </span>
          <b>{props.message}</b>
        </p>
      </div>
    </>
  );
}

export default function App() {
  const gifService = new GifService();
  const urlParams = new URLSearchParams(window.location.search);

  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<GifProps[]>([]);
  const [columns, setColumns] = useState<GifProps[][]>(
    new Array<GifProps[]>(COLUMNS)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastProps, setToastProps] = useState<ToastProps>({
    message: "",
    type: "Info",
  });

  const searchGifs = useMemo(
    () =>
      debounce((query: string, offset: number = 0) => {
        if (query == "") return;
        setIsLoading(true);
        gifService
          .fetchGifs(query, offset)
          .then((res) => {
            setGifs(res.gifs);
          })
          .catch((error) =>
            setToastProps({ message: error.message, type: "Error" })
          )
          .finally(() => setIsLoading(false));
      }, 500),
    []
  );

  function handleSearch(e: any) {
    setSearch(e.target.value);
    searchGifs(e.target.value);

    const url = new URL(window.location.toString());
    url.searchParams.set("search", e.target.value);
    history.pushState(null, "", url);
  }

  /**
   * Rearrange array of gifs into columns while maintaining order.
   * @param {GifProps[]} gifs Array of GifProps to arrange.
   * @param {number} cols Number of columns.
   * @returns {GifProps[][]} Columnized array.
   */
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

  useEffect(() => {
    if (toastProps.message == "") return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [toastProps]);

  useEffect(() => {
    let s = urlParams.get("search");
    if (!!s) {
      setSearch(s);
      searchGifs(s);
      return;
    }
    setIsLoading(true);
    gifService
      .fetchTrending()
      .then((res) => setGifs(res.gifs))
      .catch((error) =>
        setToastProps({ message: error.message, type: "Error" })
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <input
        id="search"
        type="text"
        placeholder="Search for a GIF..."
        value={search}
        onChange={handleSearch}
        autoComplete="off"
      />
      <div className="results">
        {columns.map((col, i) => (
          <div className="column" key={i}>
            {col.map((gif, j) => (
              <Gif
                key={gif.copyUrl}
                {...gif}
                copyCallback={() =>
                  setToastProps({
                    message: "Copied to clipboard!",
                    type: "Info",
                  })
                }
              />
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
      {showToast && <Toast {...toastProps} />}
    </>
  );
}
