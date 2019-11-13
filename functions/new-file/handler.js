"use strict";
const mongo = require("mongodb").MongoClient;

const mongoConnection = new Promise((resolve, reject) =>
  mongo.connect(
    "mongodb://mongodb:27017",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db) => (err ? reject(err) : resolve(db))
  )
);

const splitKey = key => ({
  bucket: key.split("/")[0],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

module.exports = async (event, context) => {
  try {
    if (event.body.Key) {
      const db = await mongoConnection;
      const fileInfo = splitKey(event.body.Key);
      const record = event.body.Records.find(
        record => record.eventName === "s3:ObjectCreated:Put"
      );
      await db.db("tp-final").collection("files").insertOne({
        _id: event.body.Key,
        ...fileInfo,
        date: record.eventTime,
        size: record.s3.object.size
      });
      context.status(200).succeed("File created!");
    }
  } catch (error) {
    console.log("TCL: error", error);
    context.status(400).fail(error);
  }
};
