const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const NodeWebcam = require('node-webcam');
const _ = require('lodash');

const credentials = new AWS.SharedIniFileCredentials({profile: 'leftly'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-1'});
const r = new AWS.Rekognition();
let Webcam = NodeWebcam.create({});
Webcam.list(l => {
  Webcam = NodeWebcam.create({device: l[1]});
  console.log(l);
});
const cars = [];
console.log(cars);
const sendPicture = async () => {
  const date = new Date();
  const timeStamp = date.getTime();

  Webcam.capture(`${timeStamp.toString()}`, async (err, image) => {
    if (err) {
      console.log(err);
    } else {
      console.log(image);
    }
    const data = fs.readFileSync(image);
    const params = {
      Image: {Bytes: data},
    };
    const res = await r.detectLabels(params).promise();
    let count = 0;
    for (i in res.Labels) {
      const x = res.Labels[i];
      if (x.Name === 'Car') {
        count = x.Instances.length;
      }
    }
    cars.push(count);
    if (cars.length > 60) {
      cars.shift();
    }
  });
};
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/when', (req, res) => {
  const avg = [];
  for (let i = 0; i < 55 && i < cars.length - 5; i++) {
    avg[i] = _.mean(cars.slice(i, i + 5));
  }
  const m = _.min(avg);
  const i = _.findLastIndex(avg, k => {
    return m === k;
  });
  const date = new Date();
  const timeStamp = date.getTime();
  const ttl = timeStamp + (i + 65) * 2000;
  const timeDiff = ttl - timeStamp;

  res.status(200).send({timeStamp, ttl, timeDiff, i});
});
const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
setInterval(sendPicture, 2000);
