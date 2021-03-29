import { User } from "./User.js";

//console.log(currentName);
// sets firebase value to div class currentName
// username.placeholder = "Username";
// sets firebase value to div class industry
//industry.placeholder = "Industry";

document.body.onload = async function () {
	var userrole = await new User().getAttribute("userrole");
	var userId = await new User().getUserId();
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			console.log("there is a currently signed in user: " + userrole + " " + userId);
			if (location.pathname.split("/")[1] !== "profile.html") {
				document.getElementById("login_profile").innerText = "Profile";
				document.getElementById("login-button").action = "profile.html";
			} else {
				const PROFILEBTN = document.getElementById("login-button");
				PROFILEBTN.remove();
			}

			document.getElementById("logout").style.visibility = "visible";
			if (userrole === "Moderator" && location.pathname.split("/")[1] !== "mod_tools.html") {
				document.getElementById("mod-tools").style.visibility = "visible";
			}
			if (userrole !== "Student") {
				document.getElementById("new-post").style.visibility = "visible";
			}
		} else {
			console.log("there is no signed in user");
		}
	});
};

var path = window.location.pathname;
var page = path.split("/").pop();
