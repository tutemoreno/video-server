import mongoose from 'mongoose';

const file = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  videoCodec: {
    type: String,
    required: true,
  },
  audioCodec: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

export default mongoose.model('File', file);
