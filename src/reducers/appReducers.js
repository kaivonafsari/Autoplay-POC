/*App Reducers*/
export default(state = {}, action) => {
	switch(action.type){
		case 'TEST':
			state[action.string] = action.string
			return state;

		default:
			return state;
	}
};