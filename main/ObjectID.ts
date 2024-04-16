/* eslint-disable @typescript-eslint/ban-types -- this is a gross hack and should expect to be flagged */
declare global {
	interface ObjectConstructor {
		id(o: Object): number;
	}
	interface Object {
		__uniqueid: number;
	}
}

// based on https://stackoverflow.com/a/1997811/955263
export function declareObjectId() {
	if (typeof Object.id != "undefined")
		return;

	let id = 1000000;

	Object.id = function (o: Object) {
		if (typeof o.__uniqueid != "undefined") {
			return o.__uniqueid;
		}

		Object.defineProperty(o, "__uniqueid", {
			value: ++id,
			enumerable: false,
			writable: false
		});

		return o.__uniqueid;
	};
}
