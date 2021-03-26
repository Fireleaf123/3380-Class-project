import { User } from "./User.js";
function setClick(element, func) {
	element.onclick = () => {
		func();
	};
}
function UserStateChecker() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			console.log("there is currently a  signed in user");
			
			let logoutButton = document.getElementById("logout");

			logoutButton.style.visibility = "visible";
		
			if (location.pathname.substring(1) !== "profile.html") {
				let btn = document.getElementById("account");
				btn.action = "profile.html";
				btn.children[0].innerHTML = "Profile";
			}
		} else {
		
			console.log("there is no signed in user");
			let logoutButton = document.getElementById("logout");
			logoutButton.style.visibility = "hidden";
		}
	});
}

document.body.onload = function () {
	UserStateChecker();
};

function signOut() {
	firebase
		.auth()
		.signOut()
		.then((t) => {
			console.log(t)
		})
		.catch((error) => {
			
		});
}

document.getElementById("logout").onclick = () => {signOut()};
