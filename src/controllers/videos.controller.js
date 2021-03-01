import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

import File from '../models/file.js';

import path from 'path';

const __dirname = path.resolve(),
  FFMPEG_PATH = __dirname + '/ffmpeg/bin/ffmpeg.exe';

ffmpeg.setFfmpegPath(FFMPEG_PATH);

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        console.log(error);
        return reject(error);
      }

      return resolve(videoInfo);
    });
  });
};

export async function getVideo(req, res) {
  const file = await File.findById(req.params.id);

  res.sendFile(path.join(__dirname, 'uploads', file.path));
}

export async function getThumb(req, res) {
  const file = await File.findById(req.params.id);

  res.sendFile(path.join(__dirname, 'thumbs', `${file.path}.png`));
}

export async function getVideos(req, res) {
  const search = req.query.search || '';

  const files = await File.find({ name: { $regex: search } });

  res.json({ files });
}

export async function deleteVideo(req, res) {
  const file = await File.findByIdAndDelete(req.params.id);

  try {
    fs.unlinkSync(path.join(__dirname, 'uploads', file.path));
    fs.unlinkSync(path.join(__dirname, 'thumbs', `${file.path}.png`));
  } catch (err) {
    console.error(err);
  } finally {
    res.json({ file });
  }
}

export async function deleteAllVideos(req, res) {
  const files = await File.deleteMany({});

  for (const file of files) {
    try {
      fs.unlinkSync(path.join(__dirname, 'uploads', file.path));
      fs.unlinkSync(path.join(__dirname, 'thumbs', `${file.path}.png`));
    } catch (err) {
      console.error(err);
    }
  }

  res.json({ files });
}

export async function uploadVideo(req, res) {
  const tmpFile = req.files.file,
    fileName = String(Date.now()),
    newPathFile = path.join('uploads', fileName);

  await tmpFile.mv(newPathFile);

  const info = await getVideoInfo(newPathFile);

  const {
      streams,
      format: { duration },
    } = info,
    videoCodec = streams[0].codec_name,
    audioCodec = streams[1].codec_name;

  const file = new File({
    name: tmpFile.name,
    path: fileName,
    duration,
    videoCodec,
    audioCodec,
  });

  await file.save();

  ffmpeg(newPathFile)
    .screenshot({
      timestamps: ['50%'],
      filename: `${fileName}.png`,
      folder: path.join(__dirname, 'thumbs'),
      size: '320x240',
    })
    .on('end', function () {
      console.log('Screenshots taken');
      res.json({ file });
    });
}
