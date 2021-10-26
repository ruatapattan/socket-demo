const rooms = ["general", "random", "jokes", "javascript"];

function Chat(props) {
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			props.sendMessage();
		}
	};
	// console.log(props.yourId);
	// console.log(props.allUsers);

	// console.log("messages", props.messages);
	props.messages.forEach((item) => console.log(item));

	return (
		<>
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
					<div
						style={{
							height: "100%",
							border: "1px solid red",
							width: "40%",
							boxSizing: "border-box",
						}}
					>
						<p>room</p>
						{rooms.map((item, idx) => (
							<div
								key={item}
								onClick={() => props.toggleChat({ chatName: item, isChannel: true, receiverId: "" })}
							>
								{item}
							</div>
						))}
						<p>all users</p>
						{props.allUsers.map((item, idx) => {
							if (item.id === props.yourId) {
								return (
									<div
										key={item.id}
										onClick={() =>
											props.toggleChat({ chatName: item, isChannel: true, receiverId: "" })
										}
									>
										you: {item.username}
									</div>
								);
							}
							return (
								<div
									key={item.id}
									onClick={() =>
										props.toggleChat({ chatName: item, isChannel: false, receiverId: item.id })
									}
								>
									{item.username}
								</div>
							);
						})}
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
						<div>{props.currentChat.chatName}</div>
						<div
							style={{
								width: "100%",
								height: "100%",
								boxSizing: "border-box",
								border: "1px solid blue",
							}}
						>
							{!props.currentChat.isChannel ||
							props.connectedRooms.includes(props.currentChat.chatName) ? (
								props.messages.map((item, idx) => {
									//render my side of message if id matches
									if (item.id === props.yourId) {
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
														<p key={item.id} style={{ margin: 0 }}>
															{item.sender}
														</p>
														<p key={item.id} style={{ margin: 0 }}>
															{item.content}
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
														{item.sender}
													</p>
													<p key={idx} style={{ margin: 0 }}>
														{item.content}
													</p>
												</div>
											</div>
										</>
									);
								})
							) : (
								<button onClick={() => props.joinRoom(props.currentChat.chatName)}>
									join {props.currentChat.chatName}
								</button>
							)}
						</div>
						<form style={{ width: "100%" }}>
							<input
								value={props.message}
								onChange={props.handleMessageChange}
								onKeyPress={handleKeyPress}
								placeholder="say something..."
								style={{ width: "80%", boxSizing: "border-box", height: "2rem" }}
							/>
							<button type="button" onClick={props.sendMessage} style={{ height: "100%", width: "20%" }}>
								send
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default Chat;
