function Form(props) {
	return (
		<form>
			<input type="text" placeholder="username..." value={props.username} onChange={props.onChange} />
			<button type="button" onClick={props.connect}>
				connect
			</button>
		</form>
	);
}

export default Form;
