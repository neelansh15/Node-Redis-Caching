const fetch = require("node-fetch");
const express = require("express");
const app = express();
const responseTime = require("response-time");
const cors = require("cors");
const PORT = 8000;

app.use(cors());
app.use(
  responseTime({
    header: "responsetime",
  })
);

const redis = require("redis");
const { response } = require("express");
const client = redis.createClient();

client.on("error", (error) => {
  console.error(error);
});

app.get("/", (req, res) => {
  client.get("foo", (err, reply) => {
    console.log("Error (if any): " + err);
    res.send(`Reply: ${reply}`);
  });
});



app.get("/search", (req, res) => {
  let search = req.query.q;
  search = search.trim().replace(" ", "+");

  //First check redis for cache
  client.get(search, (err, reply) => {
    if (reply != null) {
      console.log(`Found response for ${search} in Redis cache`);
      return res.end(reply);
    } else {
      //Call Google Books API
      try {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
          .then((response) => response.json())
          .then((json) => {
            let items = [];
            counter = 0;
            json.items.every((item) => {
              if (counter == 10) return false;
              items.push({
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                publisher: item.volumeInfo.publisher,
                publishedDate: item.volumeInfo.publishedDate,
                thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
              });
              counter++;
              return true;
            });

            //Set into Redis cache for later
            console.log(`Setting response for ${search} into Redis Cache`)
            client.set(search, JSON.stringify(items));

            return res.json(items);
          });
      } catch (e) {
        res.send("Error: " + e);
      }
    }
  });
});

app.get("/set", (req, res) => {
  client.set("foo", req.query.value, redis.print);
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
