/*App Actions*/

export const testAction = (string) => {
	return {
		type: 'TEST',
		string: "yolo"
	};
}

export const storePlayerVisible = (boolean) => {
	return {
		type: 'PLAYER_VISIBLE',
		boolean
	};
}