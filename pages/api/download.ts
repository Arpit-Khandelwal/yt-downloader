//@ts-nocheck
"use server";
import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        console.log(req.body);
        const body = JSON.parse(req.body)
        const url = body.url;
        const options = body.options;
        console.log(`url: ${url}; options:${options} `)
        let info: any = { videodetails: "audio" }
        try {
            info = await ytdl.getInfo(url);

        } catch (error) {
            console.log("error in ytdl: " + error)

        }
        const extension = options.format.includes("audio") ? "mp3" : "mp4";
        const filename = `public/media/${info.videoDetails.title}.${extension}`;

        // res.status(200).send({ msg: "Download started" });

        // Ensure the directory exists before writing
        const writeStream = fs.createWriteStream(filename);
        writeStream.on('error', (error) => {
            console.error("Error writing to file: ", error);
            res.status(500).send({ err: "File write error" });
        });
        res.json({ msg: "Download started" });

        let finalFile: string = ""
        if (extension === "mp3") {
            finalFile = await downloadAudio(url, filename);
        } else {
            finalFile = await downloadVideo(url, filename);
        }
        console.log("finalFile: " + finalFile)
        await uploadFile(finalFile);

    } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Youtube Link error" });
    }
}

async function downloadAudio(url: string, filename: string) {
    // Start downloading and piping to the file
    const audioStream = ytdl(url, { format: "highestaudio" });

    // Track download progress
    audioStream.on('progress', (chunkLength, downloaded, total) => {
        const percent = (downloaded / total) * 100;
        console.log(`Download progress: ${percent.toFixed(2)}%`);
        // You can also send progress updates to the client if needed
        // res.write(`Progress: ${percent.toFixed(2)}%\n`);
    });

    audioStream
        .pipe(writeStream)
        .on('finish', () => {
            return filename;
        })
        .on('error', (error) => {
            console.error("Error during download: ", error);
            res.status(500).send({ err: "Download error" });
        });
}

async function downloadVideo(url: string, filename: string) {
    /**
 * Reencode audio & video without creating files first
 *
 * Requirements: ffmpeg, ether via a manual installation or via ffmpeg-static
 *
 * If you need more complex features like an output-stream you can check the older, more complex example:
 * https://github.com/fent/node-ytdl-core/blob/cc6720f9387088d6253acc71c8a49000544d4d2a/example/ffmpeg.js
 */

    // Buildin with nodejs
    const cp = require('child_process');
    const readline = require('readline');
    // External modules
    const ffmpeg = require('ffmpeg-static');
    // Global constants
    const ref = url
    const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
    };

    // Get audio and video streams
    const audio = ytdl(ref, { quality: 'highestaudio' })
        .on('progress', (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
        });
    const video = ytdl(ref, { quality: 'highestvideo' })
        .on('progress', (_, downloaded, total) => {
            tracker.video = { downloaded, total };
        });

    // Prepare the progress bar
    let progressbarHandle = null;
    const progressbarInterval = 1000;
    const showProgress = () => {
        readline.cursorTo(process.stdout, 0);
        const toMB = i => (i / 1024 / 1024).toFixed(2);

        process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
        process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

        process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
        readline.moveCursor(process.stdout, 0, -3);
    };

    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Overwrite if file already exists
        '-y',
        // Set inputs
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        // Map audio & video from streams
        '-map', '0:a',
        '-map', '1:v',
        // Keep encoding
        '-c:v', 'copy',
        // Define output file
        "test.mp4"
    ], {
        windowsHide: true,
        stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
        ],
    });
    ffmpegProcess.on('close', () => {
        // Cleanup
        process.stdout.write('\n\n\n\n');
        console.log('done');
        clearInterval(progressbarHandle);
        return filename;
    });

    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data
    ffmpegProcess.stdio[3].on('data', chunk => {
        // Start the progress bar
        if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
        // Parse the param=value list returned by ffmpeg
        const lines = chunk.toString().trim().split('\n');
        const args = {};
        for (const l of lines) {
            const [key, value] = l.split('=');
            args[key.trim()] = value.trim();
        }
        tracker.merged = args;
    });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
}


// Upload file using standard upload
async function uploadFile(filename: string) {
    try {


    }

    catch (error) { }
}
