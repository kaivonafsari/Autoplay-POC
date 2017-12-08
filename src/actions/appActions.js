/*App Actions*/

export const hasUserGesture = () => {
	return {
		type: 'HAS_USER_GESTURE',
		boolean: true
	};
}

export const storePlayerVisible = (boolean) => {
	return {
		type: 'PLAYER_VISIBLE',
		boolean
	};
}