/**
 * Class that updates and gets current user Iinfo
 */
class User {
	constructor() {}
	/**
	 *gets the Id of the currently signed in user
	 * @returns {String} returns Id of current user
	 */
	getUserId() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(function () {
				resolve(firebase.auth().currentUser.uid);
			});
		});
	}

	/**
	 *updates username field of user in the database to {newEducation}
	 * @param {string} newUsername,value to changed to
	 */
	async updateUsername(newUsername) {
		let userId = await this.getUserId();
		let ref = firebase.database().ref(`users/${userId}`);
		ref.update({ username: newUsername });
	}

	/**
	 * updates Industry field of user in the database to {newEducation}
	 * @param {string} newIndustr, value to be changed to
	 */
	async updateIndustry(newIndustry) {
		let userId = await this.getUserId();
		let ref = firebase.database().ref(`users/${userId}`);
		ref.update({ industry: newIndustry });
	}
	/**
	 * updates Education field of user in the database to {newEducation}
	 * @param {string} newEducation, value to be changed to
	 */
	async updateEducation(newEducation) {
		let userId = await this.getUserId();
		let ref = firebase.database().ref(`users/${userId}`);
		ref.update({ education: newEducation });
	}

	/**
	 * gets value of {attribute} passed for the current User
	 * @param {string} attribute
	 * @returns Any, returns the value of {attribute} for the currently signed in user
	 */
	async getAttribute(attribute) {
		let ref = firebase.database().ref(`users/${await this.getUserId()}`);
		let location = ref.child(attribute);
		return new Promise((resolve, reject) => {
			location.once("value", (data) => {
				resolve(data.val());
			});
		});
	}
}

class Accounts {
	/**
	 * signs up the user using firebase's authnetication service using the info
	 * in the email and password fields
	 */
	signUpWithEmailPassword() {
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				location.href = "06_new_account2.html";
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				// ..
			});
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
			});
		// [END auth_signin_password]
	}
	/**
	 *
	 * signs in the user using firebase's authnetication service using the info
	 * in the email and password fields
	 */
	signInWithEmailPassword() {
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		// [START auth_signin_password]
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				location.href = "index.html";
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
			});
	}
	/**
	 * signs out the currently logged in user
	 */
	signOut() {
		// [START auth_sign_out]
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				setTimeout(function () {
					location.href = "index.html";
				}, 2500);
			})
			.catch((error) => {
				// An error happened.
			});
		// [END auth_sign_out]
	}
}
export { User, Accounts };
