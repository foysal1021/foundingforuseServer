const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World ok asa okey?????!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
