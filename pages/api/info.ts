import { NextApiRequest, NextApiResponse } from "next";
import { format } from "path";
import ytdl from "ytdl-core";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url;
  let info;
  try {
    if (url) {
      info = await ytdl.getInfo(url as string);
    } else {
      info = { formats: [], player_response: [] };
    }

    res.json({ formats: info.formats, player_response: info.player_response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid video URL" });
  }
}
