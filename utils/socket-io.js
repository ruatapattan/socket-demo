const socket = require("socket.io");

exports.socketConnection = (server) => {
	const io = socket(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	let users = [];

	const messages = {
		general: [],
		random: [],
		jokes: [],
		javascript: [],
	};

	io.on("connection", (socket) => {
		// console.log("socket", socket);
		//whenever joining a server
		socket.on("join server", (username) => {
			const user = {
				username,
				id: socket.id,
			};
			//push into list of users
			users.push(user);
			//emit to all clients that a new user joins
			io.emit("new user", users);
		});
		socket.on("join room", (roomName, cb) => {
			socket.join(roomName);
			//cb will come from client
			cb(messages[roomName]);
		});
		//emits an event
		// socket.emit("your id", socket.id);

		//listen when a user attempts to send message to others
		socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
			//if chat room
			if (isChannel) {
				const payload = {
					content,
					chatName, //basically room
					sender,
				};
				//emits the text and id of the sender to io so both parties get notified in rt
				//to will be socket id or room id depending on chat type
				socket.to(to).emit("new message", payload);
			} else {
				//not chat room ie dm chat
				const payload = {
					content,
					chatName: sender, //sender is a user's name
					sender,
				};
				socket.to(to).emit("new message", payload);
			}
			if (messages[chatName]) {
				messages[chatName].push({
					sender,
					content,
				});
			}
		});

		socket.on("disconntect", () => {
			//filter out the disconnected user
			users = users.filter((u) => u.id !== socket.id);

			//need this to signal the new user array to io
			io.emit("new user", users);
		});
	});
};
