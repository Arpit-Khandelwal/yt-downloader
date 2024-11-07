import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core"
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

    res.json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid video URL" });
  }
}
