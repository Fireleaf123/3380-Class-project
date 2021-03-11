/* ===============================================================================================================
 * |  JavaScript file for all user account related functions                                                     |
 * |  Functions in this file include but are not limited to account registration, signing in, and authentication |
 * | References:                                                                                                 |
 * |  Google Firebase: https://firebase.google.com/docs/auth/web/firebaseui                                      |
 * |                                                                                                             |
 * ===============================================================================================================
 * | Accounts Branch designed by: Ryan Bourdais rbourd4                                                          |
 * |  Project led by Baboya Chock                                                                                |
 * |  Latest Update: February 24, 2021                                                                           |
 * =============================================================================================================== */
 
var firebaseConfig = {
    apiKey: "AIzaSyD0ywn3gXo-BJEqPbJnzJGnr3mAUF9lBJ0",
    authDomain: "ngen-883ad.firebaseapp.com",
    databaseURL: "https://ngen-883ad-default-rtdb.firebaseio.com",
    projectId: "ngen-883ad",
    storageBucket: "ngen-883ad.appspot.com",
    messagingSenderId: "1069369171399",
    appId: "1:1069369171399:web:1e96aaa07d2a2b8e0ecde2",
    measurementId: "G-0E5SMWE8CD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
 import firebase from "firebase/app";
 import "firebase/auth";
 
 // User First Name Validation


 firebase.auth().createUserWithEmailAndPassword(email, password)
 .then((userCredential) => {
   // Signed in 
   var user = userCredential.user;
   // ...
 })
 .catch((error) => {
   var errorCode = error.code;
   var errorMessage = error.message;
   // ..
 });

 var provider = new firebase.auth.GoogleAuthProvider();

 firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });