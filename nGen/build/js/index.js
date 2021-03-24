
import {Firebase} from './firebase.js'


   const FIRE = new Firebase();
  FIRE.updateUsername('google');
  FIRE.updateIndustry('tech');
 // FIRE.updateUsername('google');
  
  // WIP: setting variables for html input
 // let username = document.getElementById("username");
  //let industry = document.getElementById("industry");

  
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
      } else {
        console.log("there is no signed in user");
      }
    });
  }
  document.body.onload= function(){
    UserStateChecker();
  }





