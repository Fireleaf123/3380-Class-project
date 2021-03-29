/* ===============================================================================================================
 * |  JavaScript file for all user account related functions                                                     |
 * |  Functions in this file include but are not limited to account registration, signing in, and authentication |
 * |  References:                                                                                                |
 * |  Google Firebase: https://firebase.google.com/docs/auth/web/firebaseui                                      |
 * |                                                                                                             |
 * ===============================================================================================================
 * | Accounts Branch designed by: Ryan Bourdais rbourd4                                                          |
 * |  Project led by Baboya Chock                                                                                |
 * |  Latest Update: March 24, 2021                                                                              |
 * ===============================================================================================================
 */

import { Accounts, User } from "./User.js";
import { Firebase } from "./content_mngr.js";
const Acct = new Accounts();
const Fire = new Firebase();

var path = window.location.pathname;
var page = path.split("/").pop();

if (page === "04_new_account.html") {
	document.getElementById("signupbutton").onclick = () => {
		Acct.signUpWithEmailPassword();
	};
} else if (page === "05_login.html") {
	document.getElementById("login-button").onclick = () => {
		Acct.signInWithEmailPassword();
	};
} else if (page === "06_new_account2.html") {
	var userId;
	new User().getUserId().then((User) => {
		userId = User;
	});

	document.getElementById("saveuser").onclick = () => {
		Fire.saveUser(userName, userBday, userId, userRole, userIndustry, userEducation);
	};
} else {
	document.getElementById("logout").onclick = () => {
		Acct.signOut();
	};
}
