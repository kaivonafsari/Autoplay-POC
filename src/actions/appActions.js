/*App Actions*/
import videoArray from '../services/mockService';

export const hasUserGesture = () => {
	return {
		type: 'HAS_USER_GESTURE',
		boolean: true
	};
}

export const storeHasAutoplay = (boolean) => {
	return {
		type: "HAS_AUTOPLAY",
		boolean
	}
}

export const storePlayerVisible = (boolean) => {
	return {
		type: 'PLAYER_VISIBLE',
		boolean
	};
}

export const storeAdState = (adState) => {
	return {
		type: 'AD_STATE',
		adState
	};
}

export const storePlayerRef = (playerRef) => {
	return {
		type: 'PLAYER_REF',
		playerRef
	}
}

export const storeVideoState = (videoState) => {
	return {
		type: 'VIDEO_STATE',
		videoState
	};
}

export const getVideoSrc = (currentIndex) => {
  	let nextIndex = currentIndex+1;
  	let videoSrc = "";

	if (videoArray[nextIndex]){
		videoSrc = videoArray[nextIndex];
	} else {
		videoSrc = videoArray[0];
	}
	
	return {
		type: 'VIDEO_SRC',
		src: videoSrc
	}
}