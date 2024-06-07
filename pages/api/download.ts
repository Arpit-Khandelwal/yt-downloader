import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = req.query.url || "";
    const itag = req.query.itag || -1;
    const extension =req.query.extension||"";
    try {
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="yt-downloader.${extension}"`
        );
        console.log(url, itag, extension)
        ytdl(url as string, { quality: itag as number }).pipe(res);
    } catch (err) {
        res.status(500).send("Youtube Link error");
    }
}
