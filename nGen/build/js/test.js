import { DataHandler } from "./content_mngr.js";

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.write("Hello " + user.displayName);
      console.log(user);
    })
    .cath(console.log);
}

//createPost();
