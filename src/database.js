import mongoose from 'mongoose';

const uri = 'mongodb://localhost/videosdb';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', function (err) {
  console.log(err);
});
db.once('open', function () {
  console.log('mongoDB is connected');
});
