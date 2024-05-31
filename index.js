import ytdl from "ytdl-core";

import e from "express";

const app = e();
const port = 3000;

app.use(e.json());

app.post("/", async (req, res) => {
  const url = req.body.url;
  console.log(url);
  let info, format, downloadLink;
  if (url) {
    info = await ytdl.getInfo(url);
    format = ytdl.chooseFormat(info.formats, { quality: "highest" });
    downloadLink = format['url']
    console.log("Format found!", format);
  } else {
    downloadLink = '';
  }

  res.json(downloadLink);
});

app.listen(port, () => {
  console.log("server started on 3000");
});
