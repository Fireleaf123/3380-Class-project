import { User } from "./User.js";
function setClick(element,func){
  element.onclick = () => {func()}
}
function UserStateChecker() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			console.log("there is currently a  signed in user");
			let btn = document.getElementById("account");
			btn.action = "profile.html";
			btn.children[0].innerHTML = "Profile";

			let logoutButton = document.getElementById("logout");

			logoutButton.style.visibility = "visible";
			logoutButton.onclick = () => {console.log('hello')}
			
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
