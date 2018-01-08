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

		case 'HAS_AUTOPLAY':
			store = store.set('hasAutoplay', payload.boolean)
			return store;

		case 'VIDEO_SRC':
			store = store.set('videoSource', payload.src)
			return store;

		case 'AD_STATE':
			store = store.set('adState', payload.adState)
			return store;

		case 'VIDEO_STATE':
			store = store.set('videoState', payload.videoState)
			return store;

		case 'PLAYER_REF':
			store = store.set('playerRef', payload.playerRef)
			return store;

		default:
			return store;
	}
};