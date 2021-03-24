
import {User} from './User.js'


   const FIRE = new User();
 // FIRE.updateUsername('google');
  
  // WIP: setting variables for html input
  const USERNAME = document.getElementById("username");
  const INDUSTRY = document.getElementById("industry");
  const EDUCATION = document.getElementById("education");
  const DEFAULTSELECTION = document.getElementById("test");

  FIRE.getAttribute("username").then( username => USERNAME.placeholder= username)
  FIRE.getAttribute("industry").then( industry => INDUSTRY.placeholder= industry)
  FIRE.getAttribute("education").then( education => DEFAULTSELECTION.innerHTML = education)
 

  //console.log(currentName);
  // sets firebase value to div class currentName
 // username.placeholder = "Username";
  // sets firebase value to div class industry
  //industry.placeholder = "Industry";

  function UserStateChecker(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      // User is signed in.
      console.log("there is a currently signed in user");
 
      /*
      let logoutButton = document.getElementById("logout");
      console.log(logoutButton);
      logoutButton.style.visibility = "visible";
      logoutButton.onClick= function(){
          console.log("logout");
        //firebase.auth().getInstance().signOut();
      }*/
      
      } else {
        console.log("there is no signed in user");
        let logoutButton = document.getElementById("logout");
        logoutButton.style.visibility = "hidden";
      }
    });
  }
  document.body.onload= function(){
    UserStateChecker();
  }

document.getElementById("update").onclick = function(){
    const FIRE = new User();
    if (USERNAME.value !== "")
        FIRE.updateUsername(USERNAME.value);
    if (INDUSTRY.value !== "")
        FIRE.updateIndustry(INDUSTRY.value);
    if (EDUCATION.value !== "")
        FIRE.updateEducation(EDUCATION.value);
   // FIRE.updateUsername('google');
}



