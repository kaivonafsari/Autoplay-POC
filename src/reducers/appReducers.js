import Immutable from 'immutable';

/*App Reducers*/
export default(store = (new Immutable.Map()), payload) => {
	switch(payload.type){
		case 'HAS_USER_GESTURE':
			store = store.set('hasUserGesture', payload.boolean)
			return store;

		case 'PLAYER_VISIBLE':
			store = store.set('playerVisible', payload.boolean)
			return store;

		default:
			return store;
	}
};