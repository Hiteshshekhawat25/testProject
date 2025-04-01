require("dotenv").config();
const express = require("express");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const http = require("http");
const { Server } = require("socket.io");
const sockets = require("./sockets");

require("./db/connect");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

const PORT = process.env.PORT;

const publicDirPath = path.join(__dirname, "public");
app.use(express.static(publicDirPath));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Authorization "
  );
  next();
});
app.use(cors());

app.use("/api/v1", router);
sockets(io);

server.listen(PORT, () => console.log(`Server running on port:${PORT}`));

