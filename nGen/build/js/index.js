import { User } from './User.js'





//console.log(currentName);
// sets firebase value to div class currentName
// username.placeholder = "Username";
// sets firebase value to div class industry
//industry.placeholder = "Industry";


document.body.onload = async function () {
	var userrole = await new User().getAttribute('userrole');
	var userId = await new User().getUserId();
	console.log(userId + userrole);	
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) { 
			    // User is signed in.
			      console.log("there is a currently signed in user: " + userrole + " " + userId);           
			      document.getElementById('login-button').style.visibility = 'hidden';                                                                                                          
				  document.getElementById('profile-button').style.visibility = 'visible';
				  document.getElementById('logout').style.visibility = 'visible';
				if (userrole ==='Moderator')  {
					document.getElementById('mod-tools').style.visibility = 'visible';
				}
			    if (userrole !=='Student')  {
			      document.getElementById('new-post').style.visibility = 'visible';
			    }
			console.log(userrole);
			    
			}
				else {
					console.log("there is no signed in user");
				  }
    });
}


var path = window.location.pathname;
var page = path.split("/").pop();
if (page === "profile.html") {

	const FIRE = new User();
	// FIRE.updateUsername('google');

	// WIP: setting variables for html input
	const USERNAME = document.getElementById("username");
	const INDUSTRY = document.getElementById("industry");
	const EDUCATION = document.getElementById("education");
	const DEFAULTSELECTION = document.getElementById("test");

	FIRE.getAttribute("username").then(username => USERNAME.placeholder = username)
	FIRE.getAttribute("industry").then(industry => INDUSTRY.placeholder = industry)
	FIRE.getAttribute("education").then(education => DEFAULTSELECTION.innerHTML = education)


	document.getElementById("update").onclick = function () {
		const FIRE = new User();
		if (USERNAME.value !== "")
			FIRE.updateUsername(USERNAME.value);
		if (INDUSTRY.value !== "")
			FIRE.updateIndustry(INDUSTRY.value);
		if (EDUCATION.value !== "")
			FIRE.updateEducation(EDUCATION.value);
		// FIRE.updateUsername('google');
	}
}

