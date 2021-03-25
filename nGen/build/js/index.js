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

function GetUserId() {
	return new Promise( (resolve,reject) => {
	 firebase.auth().onAuthStateChanged(function(user) {
	   resolve(firebase.auth().currentUser.uid)
	  });
	})
 }

 function GetUserRole(userId) {
	var UserRoleRef = firebase.database().ref(`users/${userId}`).child('userrole');
	return new Promise( (resolve,reject) => {
		 UserRoleRef.once("value", (userrole) => {
		resolve(userrole.val());
	}) 
	});
  }
  
async function IndexUserStateChecker(){
	var userId = await GetUserId();
	var userrole = await GetUserRole(userId);
	firebase.auth().onAuthStateChanged(function(user)
	
	 {
	  //await GetUserRole(userId).then( (role) => { userrole = role;})
	  if (user) { 
	  // User is signed in.
	  //GetUserRole(userId).then( (role) => { userRole = role}) 
		console.log("there is a currently signed in user: " + userrole + " " + userId);           
		document.getElementById('login-button').style.visibility = 'hidden';   
		document.getElementById('log_user_out').style.visibility = 'visible';                                                                                                       
	  } else {
		console.log("there is no signed in user");
		document.getElementById('my-profile-button').style.visibility = 'visible'; 
		  
	  }
	  
	  if (userrole =='Professional')  {
		document.getElementById('new-post').style.visibility = 'visible';
	  }
	  else if (userrole !== 'Professional'){
		document.getElementById('new-post').style.visibility = 'hidden';
	  }
  
	  if (userrole =='Moderator')  {
		document.getElementById('mod-tools').style.visibility = 'visible';
	  }
	  else if (userrole !== 'Moderator'){
		document.getElementById('mod-tools').style.visibility = 'hidden';
	  }
	});
  }


document.body.onload = function () {
	IndexUserStateChecker();
};
