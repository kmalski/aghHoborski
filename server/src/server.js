require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socket(http);

const port = process.env.PORT || 4040;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
