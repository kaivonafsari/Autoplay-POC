/*App Reducers*/
export default(state = {}, payload) => {
	switch(payload.type){
		case 'TEST':
			state.string = payload.string
			return state;

		default:
			return state;
	}
};