// const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const { socketConnection } = require("./utils/socket-io");

socketConnection(server);

server.listen(9000, () => console.log("server is running on port 9000"));
