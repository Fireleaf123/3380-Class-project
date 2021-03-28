
import {User} from './User.js'


   const FIRE = new User();

  
  // setting variables for html input from correspoding  IDs
  const USERNAME = document.getElementById("username");
  const INDUSTRY = document.getElementById("industry");
  const EDUCATION = document.getElementById("education");
  const DEFAULTSELECTION = document.getElementById("test");
  // sets the placeholder to hold the values from firebase from the variables defined above. 
  FIRE.getAttribute("username").then( username => USERNAME.placeholder= username)
  FIRE.getAttribute("industry").then( industry => INDUSTRY.placeholder= industry)
  FIRE.getAttribute("education").then( education => DEFAULTSELECTION.innerHTML = education)
 
  //function that checks if the user is currently logged in or not.
  function UserStateChecker(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      // User is signed in.
      console.log("there is a currently signed in user");
      let btn= document.getElementById("account");
      btn.action= "profile.html";
      btn.children[0].innerHTML= "Profile";
        // adds logout button if user is logged in
      let logoutButton = document.getElementById("logout");
      console.log(logoutButton);
      logoutButton.style.visibility = "visible";
      logoutButton.onClick= function(){
          console.log("logout");
       
      }
      } else {
        // no user currently logged in.
        console.log("there is no signed in user");
        let logoutButton = document.getElementById("logout");
        logoutButton.style.visibility = "hidden";
      }
    });
  }
  document.body.onload= function(){
    UserStateChecker();
  }
// function that saves the values from the input boxes, does nothing if no change.
document.getElementById("update").onclick = function(){
    const FIRE = new User();
    if (USERNAME.value !== "")
        FIRE.updateUsername(USERNAME.value);
    if (INDUSTRY.value !== "")
        FIRE.updateIndustry(INDUSTRY.value);
    if (EDUCATION.value !== "")
        FIRE.updateEducation(EDUCATION.value);
}



