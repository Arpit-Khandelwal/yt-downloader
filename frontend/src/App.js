import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("");

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const callBackend = async (event) => {
    console.log("url from call backend: ", url);
    const res = await fetch(
      `http://192.168.29.157:3001/download?url=${encodeURIComponent(
        url
      )}&quality=${quality}`
    );
    if (!res.ok) {
      console.error("Server error");
      setTitle(res.status);
      setThumbnailUrl("");
      return;
    }
    const blob = await res.blob();
    const urlObject = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlObject;
    let extension = quality.includes("audio") ? "mp3" : "mp4";
    link.download = `title.${extension}`; //todo: get video title from ytdl.getinfo
    link.click();
  };

  const getDetails = async (event) => {
    console.log("inside get details wit url:", url);

    const res = await fetch(
      `http://192.168.29.157:3001/info?url=${encodeURIComponent(url)}`
    );

    if (res.ok) {
      let data = await res.json();
      console.log(data["player_response"]["videoDetails"]["title"]);

      let thumbnailUrl =
      data["player_response"]["videoDetails"]["thumbnail"]["thumbnails"];
      thumbnailUrl = thumbnailUrl[0]["url"]; //todo: make adaptive based on device resolution

      setTitle(data["player_response"]["videoDetails"]["title"]);
      setThumbnailUrl(thumbnailUrl);
    }
  };

  useEffect(() => {
    if (url && quality) {
      callBackend();
    }
  }, [quality]);

  useEffect(() => {
    if (url) {
      getDetails();
    }
  }, [url]);

  return (
    <div className="App">
      <form>
        <input
          type="text"
          placeholder="Enter Youtube URL"
          value={url}
          onChange={async (e) => {
            setUrl(e.target.value);
          }}
          // onPaste={async (e) => {
          //   const pastedUrl = e.clipboardData.getData("Text");
          //   console.log(pastedUrl);
          //   setUrl(pastedUrl);
          // }}
        />
        {/* <button type="submit">Submit</button> */}
      </form>
      {thumbnailUrl && <img src={thumbnailUrl}></img>}
      {title && (
        <div>
          {title}
          <button onClick={()=>setQuality("highestaudio")}>Audio</button>
          <button onClick={()=>setQuality("highest")}>Video</button>
        </div>
      )}
    </div>
  );
}

export default App;
