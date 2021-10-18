import React, { useState, useEffect, useRef } from "react";
import * as io from "socket.io-client";
import styled from "styled-components";

function App() {
	const [yourId, setYourId] = useState();
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");

	const socketRef = useRef();

	useEffect(() => {
		socketRef.current = io.connect("http://localhost:9000");
		// socketRef.current = io.connect("/"); //set proxy already

		//send id to server to know who you are
		socketRef.current.on("your id", (id) => {
			setYourId(id);
		});

		//send id & message when you send chat
		socketRef.current.on("message", (message) => {
			receivedMessage(message);
		});
	}, []);

	function receivedMessage(message) {
		setMessages((cur) => [...cur, message]);
	}
	function sendMessage(e) {
		e.preventDefault();
		const messageObj = {
			body: message,
			id: yourId,
		};
		setMessage("");
		socketRef.current.emit("send message", messageObj);
	}

	function handleChange(e) {
		setMessage(e.target.value);
	}

	return (
		<div className="App" style={{ height: "300px", margin: "100px" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
			>
				<div
					style={{
						border: "2px solid black",
						width: "500px",
						height: "100%",
						padding: "0.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div style={{ height: "100%", border: "1px solid red", width: "40%", boxSizing: "border-box" }}>
						<p>room</p>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							alignItems: "center",
							border: "2px solid black",
							width: "60%",
							height: "100%",
							boxSizing: "border-box",
							padding: "0.5rem",
						}}
					>
						<div
							style={{ width: "100%", height: "100%", boxSizing: "border-box", border: "1px solid blue" }}
						>
							{messages.map((item, idx) => {
								//render my side of message if id matches
								if (item.id === yourId) {
									return (
										<>
											<div
												style={{
													boxSizing: "border-box",
													width: "100%",
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
													alignItems: "flex-end",
												}}
											>
												<div
													style={{
														position: "relative",
														left: "0",
														width: "40%",
														backgroundColor: "lightGreen",
														border: "1px solid black",
													}}
												>
													{/* <p style={{ margin: 0 }}>me</p> */}
													<p key={idx} style={{ margin: 0 }}>
														{item.body}
													</p>
												</div>
											</div>
										</>
									);
								}
								//if not mine, render the other side's message
								return (
									<>
										<div
											style={{
												boxSizing: "border-box",
												width: "100%",
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
												alignItems: "flex-start",
											}}
										>
											<div
												style={{
													position: "relative",
													left: "0",
													width: "40%",
													backgroundColor: "lightGray",
													border: "1px solid black",
												}}
											>
												{/* <p style={{ margin: 0 }}>me</p> */}
												<p key={idx} style={{ margin: 0 }}>
													{item.body}
												</p>
											</div>
										</div>
									</>
								);
							})}
						</div>
						<form onSubmit={sendMessage} style={{ width: "100%" }}>
							<input
								value={message}
								onChange={handleChange}
								placeholder="say something..."
								style={{ width: "80%", boxSizing: "border-box", height: "2rem" }}
							/>
							<button style={{ height: "100%", width: "20%" }}>send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
