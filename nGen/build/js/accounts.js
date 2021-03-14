/* ===============================================================================================================
 * |  JavaScript file for all user account related functions                                                     |
 * |  Functions in this file include but are not limited to account registration, signing in, and authentication |
 * |  References:                                                                                                 |
 * |  Google Firebase: https://firebase.google.com/docs/auth/web/firebaseui                                      |
 * |                                                                                                             |
 * ===============================================================================================================
 * | Accounts Branch designed by: Ryan Bourdais rbourd4                                                          |
 * |  Project led by Baboya Chock                                                                                |
 * |  Latest Update: March 11, 2021                                                                              |
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

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
      .then(result =>{
          const user = result.user;
          document.write('Hello ' + user.displayName);
          console.log(user)
      })
      .cath(console.log)
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

function saveUser(userName, userBbday, userId) {
  var userId = firebase.auth().currentUser.uid;
  var userName = document.getElementById("userName").value;
  var userBday = document.getElementById("userBday").value;
  //let newKey = this.database.ref().push().key;
  firebase.database().ref(`users/${userId}/`).set({
      userId: userId,
      username: userName,
      birthday: userBday,
  });
  location.href = "index.html"
}
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
