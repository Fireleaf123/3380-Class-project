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

function signUpWithEmailPassword() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      location.href = "06_new_account2.html"
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    }
    );
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  // [END auth_signin_password]
}


function signInWithEmailPassword() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  // [START auth_signin_password]
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      location.href = "index.html"
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}
  //initialize variables for saveUser()

function saveUser(userName, userBday, userId, userRole) {
  var userId = firebase.auth().currentUser.uid;
  var userName = document.getElementById("userName").value;
  var userBday = document.getElementById("userBday").value;
  var userRole = document.getElementById("userRole").value;
  //let newKey = this.database.ref().push().key;
  firebase.database().ref(`users/${userId}/`).set({
      userId: userId,
      username: userName,
      birthday: userBday,
      userrole: userRole,
  });
  setTimeout(function(){location.href = "index.html"} , 2500);
}

async function UserStateChecker(){
  var userId = await GetUserId();
  var userrole = await GetUserRole(userId);
  firebase.auth().onAuthStateChanged(function(user)
  
   {
    //await GetUserRole(userId).then( (role) => { userrole = role;})
    if (user) { 
    // User is signed in.
    //GetUserRole(userId).then( (role) => { userRole = role}) 
      console.log("there is a currently signed in user: " + userrole + " " + userId);                                                                                                                     
    } else {
      console.log("there is no signed in user");
    }
  });
}

function GetUserRole(userId) {
  var UserRoleRef = firebase.database().ref(`users/${userId}`).child('userrole');
  return new Promise( (resolve,reject) => {
       UserRoleRef.once("value", (userrole) => {
      resolve(userrole.val());
  }) 
  });
}

function GetUserId() {
   return new Promise( (resolve,reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      resolve(firebase.auth().currentUser.uid)
     });
   })
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
    } else {
      console.log("there is no signed in user");
      document.getElementById('my-profile-button').style.visibility = 'hidden'; 
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
