class Cookie {
	constructor() {}

	/**
	 *
	 * @param {string} cname, name of the cookie
	 * @param {string} cvalue, value to be stored
	 * @param {int} exdays, number of days till cookie is deleted
	 */
	setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	/**
	 *
	 * @param {string} cname, name of cookie to be retrieved
	 * @returns the value of the string with the name {cname}
	 */
	getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
}

export { Cookie };
