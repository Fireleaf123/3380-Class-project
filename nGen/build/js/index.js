import { User } from "./User.js";
function setClick(element, func) {
	element.onclick = () => {
		func();
	};
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
		document.getElementById('logout').style.visibility = 'visible';   
		document.getElementById('profile-button').style.visibility = 'visible'; 
		document.getElementById('login-button').style.visibility = 'hidden'; 
		if (userrole =='Professional')  
		{
			document.getElementById('new-post').style.visibility = 'visible';
		}
		if (userrole =='Moderator')  
		{
			document.getElementById('mod-tools').style.visibility = 'visible';
			document.getElementById('new-post').style.visibility = 'visible';
		}                                                                                                    
	  } else {
		console.log("there is no signed in user");
		document.getElementById('my-profile-button').style.visibility = 'visible'; 	  
	  }
	  
	});
  }





function signOut() {
	// [START auth_sign_out]
	
	firebase.auth().signOut().then(() => {
	  // Sign-out successful.
	  setTimeout(function(){location.href = "index.html"} , 2500);
	}).catch((error) => {
	  // An error happened.
	});
	// [END auth_sign_out]
  }

//calls 

