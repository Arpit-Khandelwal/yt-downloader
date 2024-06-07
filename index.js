import ytdl from "ytdl-core";
import cors from "cors";
import e from "express";
import morgan from "morgan";

const app = e();
const PORT = process.env.PORT || 3001;

app.use(e.json());
app.use(morgan("dev"));
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.get("/info", async (req, res) => {
  const url = req.query.url;
  let info, format, downloadLink;
  try {
    if (url) {
      info = await ytdl.getInfo(url);

      format = ytdl.chooseFormat(info.formats, { quality: "highest" });
      downloadLink = format["url"];
    } else {
      downloadLink = "";
    }
    console.log(downloadLink);

    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "Invalid video URL" });
  }
});

app.get("/download", (req, res) => {
  const url = req.query.url;
  const quality = req.query.quality;
  let extension = quality.includes("audio") ? "mp3" : "mp4";
  try {
    res.header(
      "Content-Disposition",
      `attachment; filename="video.${extension}"`
    );
    ytdl(url, { quality: quality }).pipe(res);
  } catch (err) {
    res.status(500).send("Youtube Link error");
  }
});

app.listen(PORT, () => {
  console.log("server started on ", PORT);
});
