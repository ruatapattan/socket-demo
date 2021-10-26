import React, { useState, useEffect, useRef } from "react";
import * as io from "socket.io-client";
import immer from "immer";
import Chat from "./components/Chat";
import Form from "./components/Form";

const initialMessageState = {
	general: [],
	random: [],
	jokes: [],
	javascript: [],
};

function App() {
	const [username, setUsername] = useState("");
	const [connected, setConnected] = useState(false);
	const [currentChat, setCurrentChat] = useState({
		isChannel: true,
		chatName: "general",
		revceivedId: "",
	});
	const [connectedRooms, setConnectedRooms] = useState(["general"]);
	const [allUsers, setAllUsers] = useState([]);
	const [messages, setMessages] = useState(initialMessageState);
	const [message, setMessage] = useState("");
	const socketRef = useRef();

	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	};

	useEffect(() => {
		setMessage("");
	}, [messages]);

	const sendMessage = () => {
		const payload = {
			content: message,
			to: currentChat.isChannel ? currentChat.chatName : currentChat.revceivedId,
			sender: username,
			id: socketRef.current.id,
			chatName: currentChat.chatName,
			isChannel: currentChat.isChannel,
		};
		// console.log(payload);
		socketRef.current.emit("send message", payload);
		const newMessages = immer(messages, (draft) => {
			draft[currentChat.chatName].push({
				id: socketRef.current.id,
				sender: username,
				content: message,
			});
		});
		setMessages(newMessages);
	};

	const roomJoinCallback = (incomingMessages, room) => {
		const newMessages = immer(messages, (draft) => {
			//all prior messages will be shown for a new user via this
			draft[room] = incomingMessages;
		});
		setMessages(newMessages);
	};

	const joinRoom = (room) => {
		const newConnectedRooms = immer(connectedRooms, (draft) => {
			draft.push(room);
		});

		//this is the cb in backend
		socketRef.current.emit("join room", room, (messages) => roomJoinCallback(messages, room));
		setConnectedRooms(newConnectedRooms);
	};

	//called when creating/changing chatroom
	const toggleChat = (currentChat) => {
		//if this room wasnt created yet
		if (!messages[currentChat.chatName]) {
			const newMessages = immer(messages, (draft) => {
				//create the room in obj, assigned log as empty
				draft[currentChat.chatName] = [];
			});
			//set the new room list
			setMessages(newMessages);
		}

		setCurrentChat(currentChat);
	};

	const handleChange = (e) => {
		setUsername(e.target.value);
	};

	const connect = () => {
		setConnected(true);
		socketRef.current = io.connect("http://localhost:9000");
		socketRef.current.emit("join server", username);
		socketRef.current.emit("join room", "general", (messages) => roomJoinCallback(messages, "general"));
		socketRef.current.on("new user", (allUsers) => {
			setAllUsers(allUsers);
		});
		//listens to 'new message' event
		socketRef.current.on("new message", ({ content, sender, chatName }) => {
			//set state via fn

			setMessages((messages /*basically cur*/) => {
				const newMessages = immer(messages, (draft) => {
					//if room exist push
					if (draft[chatName]) {
						draft[chatName].push({ content, sender });
					} else {
						//else create the []
						draft[chatName] = [{ content, sender }];
					}
				});
				return newMessages;
			});
		});
	};

	console.log(connected);
	console.log(messages);
	console.log(socketRef.current);

	return (
		<div className="App" style={{ height: "300px", margin: "100px" }}>
			{connected ? (
				<Chat
					message={message}
					handleMessageChange={handleMessageChange}
					sendMessage={sendMessage}
					yourId={socketRef.current ? socketRef.current.id : ""}
					allUsers={allUsers}
					joinRoom={joinRoom}
					connectedRooms={connectedRooms}
					currentChat={currentChat}
					toggleChat={toggleChat}
					messages={messages[currentChat.chatName]}
				/>
			) : (
				<Form username={username} onChange={handleChange} connect={connect} />
			)}
		</div>
	);
}

export default App;
