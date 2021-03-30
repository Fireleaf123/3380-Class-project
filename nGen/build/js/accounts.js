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
/**
 * The below string of conditionals determines which function to
 * based on the page the user is on.
 * i.e. whether to signUp,signIn, or save profile info
 */
if (page === "04_new_account.html") {
	document.getElementById("signupbutton").onclick = () => {
		//saves user credentials using Firebase's Authentication service
		Acct.signUpWithEmailPassword();
	};
} else if (page === "05_login.html") {
	document.getElementById("login-button").onclick = () => {
		//Authenicates credentials and signs in the user using the form info
		Acct.signInWithEmailPassword();
	};
} else if (page === "06_new_account2.html") {
	var userId;
	new User().getUserId().then((User) => {
		userId = User;
	});

	document.getElementById("saveuser").onclick = () => {
		/**
		 * saves user account info to firebase real time database to be used to build profile
		 * and display different elements based on role, i.e student,professional,or mod/admin
		 */
		Fire.saveUser(userName, userBday, userId, userRole, userIndustry, userEducation);
	};
} else {
	document.getElementById("logout").onclick = () => {
		//signs the user out
		Acct.signOut();
	};
}
