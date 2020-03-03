// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const request = require('request');

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);


db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE TweetEmbedCode (id INTEGER PRIMARY KEY, code TEXT)"
    );
    console.log("New table TweetEmbedCode created!");
  } else {
    console.log('Database "TweetEmbedCode" ready to go!');
    db.each("SELECT * from TweetEmbedCode", (err, row) => {
      if (row) {
        console.log(`${row.id}: ${row.code}`);
      }
    });
  }
});
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/twitter/status", (req, res) => {
  const query = {
    "id": req.query.id,
    "tweet_mode": "extended",
    "include_entities": true
  };
  const options = {
    url: "https://api.twitter.com/1.1/statuses/show.json",
    headers: {
      "Authorization": process.env.TwitterAppToken
    },
    qs: query,
    json: true
  };

  const getTextWithoutEntities = (status) => {
    return ["hashtags", "media", "urls", "user_mentions", "symbols", "extended_entities"].reduce((arr,name) => {
      Array.prototype.push.apply(arr, status.entities[name]);
      return arr;
    }, [])
    .map((e) => e.indices)
    .sort((a,b) => a[0] < b[0])
    .reduce((text, indices) => text.slice(0, indices[0]) + text.slice(indices[1]), status.full_text);
  }
  const removeAfterHashTag = (text, hashtag) => {
    return text.slice(0, hashtag.indices[0]);
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const code = getTextWithoutEntities(body);
      console.log(code);
      res.status(response.statusCode).json({"text":code,"user_id":body.user_id_str,"status_id":body.id_str});
    }else{
      console.log('error: '+ response.statusCode);
      res.status(response.statusCode).json(body);
    }
  });
});

app.get("/twitter/search", (req, res) => {
  const options = {
    url: "https://api.twitter.com/1.1/search/tweets.json",
    headers: {
      "Authorization": process.env.TwitterAppToken
    },
    qs: req.query,
    json: true
  };
  request.get(options, function (error, response, body) {
    res.json(body);
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
