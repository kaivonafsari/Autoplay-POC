import Immutable from 'immutable';

/*App Reducers*/
export default(store = (new Immutable.Map()), payload) => {
	switch(payload.type){
		case 'TEST':
			store = store.set('test', payload.string)
			return store;

		case 'PLAYER_VISIBLE':
			store = store.set('playerVisible', payload.boolean)
			return store;

		default:
			return store;
	}
};