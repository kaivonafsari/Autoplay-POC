/*App Actions*/

export const testAction = (string) => {
	console.log("testAction", string);
	return {
		type: 'TEST',
		string: "yolo"
	};
}

export const storePlayerVisible = (boolean) => {
	console.log("--storePlayerVisible", boolean);
	return {
		type: 'PLAYER_VISIBLE',
		boolean
	};
}