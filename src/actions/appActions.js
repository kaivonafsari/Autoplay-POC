/*App Actions*/

export const testAction = (string) => {
	console.log("testAction", string);
	return {
		type: 'TEST',
		string: "yolo"
	};
}