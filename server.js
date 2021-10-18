const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const socket = require("socket.io");
const io = socket(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	//emits an event
	socket.emit("your id", socket.id);

	//listen when a user attempts to send message to others
	socket.on("send message", (body) => {
		//emits the text and id of the sender to io so both parties get notified in rt
		io.emit("message", body);
	});
});

server.listen(9000, () => console.log("server is running on port 9000"));
