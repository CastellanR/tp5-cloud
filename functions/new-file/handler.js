"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoConnection = new Promise((resolve, reject) =>
  mongoose.connect(
    "mongodb://mongodb:27017/tp-final",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db) => (err ? reject(err) : resolve(db))
  )
);

const File = mongoose.model(
  "File",
  new Schema({
    name: String,
    date: Date,
    size: Number,
    type: String,
    bucket: String,
    data: {
      type: mongoose.SchemaTypes.Mixed,
      required: false
    }
  })
);

const splitKey = key => ({
  bucket: key.split("/")[0],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

module.exports = async (event, context) => {
  try {
    if (event.body.Key) {
      await mongoConnection;
      const fileInfo = splitKey(event.body.Key);
      const record = event.body.Records.find(
        record => record.eventName === "s3:ObjectCreated:Put"
      );
      const newFile = new File({
        ...fileInfo,
        date: record.eventTime,
        size: record.s3.object.size
      });
      const response = await newFile.save();
      context.status(200).succeed(response);
    }
  } catch (error) {
    console.log("TCL: error", error);
    context.status(400).fail(error);
  }
};
