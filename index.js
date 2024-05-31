import ytdl from "ytdl-core";

import e from "express";

const app = e();
const PORT = process.env.PORT || 3000;


app.use(e.json());

app.post("/download", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  let info, format, downloadLink;
  if (url) {
    info = await ytdl.getInfo(url);
    format = ytdl.chooseFormat(info.formats, { quality: "highest" });
    downloadLink = format["url"];
  } else {
    downloadLink = "";
  }

  res.json(downloadLink);
});

app.get("/", (req, res) => {
  const url = req.query.url;
  if (url) {
    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { quality: "highest" }).pipe(res);
  } else {
    res.status(400).send("Please provide a video URL");
  }
});

app.listen(PORT, () => {
  console.log("server started on 3000");
});
