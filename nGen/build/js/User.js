class User{
    constructor(){

    }
    getUserId(){
        
        return new Promise( (resolve,reject) => {
            firebase.auth().onAuthStateChanged( 
                function(){
                    resolve(firebase.auth().currentUser.uid)

                }
            );
        })
    }
   async updateUsername(newUsername){
        let userId = await this.getUserId();
        let ref = firebase.database().ref(`users/${userId}`);
        ref.update(
           {username:newUsername}
        )
    }
    async updateIndustry(newIndustry){
        let userId = await this.getUserId();
        let ref = firebase.database().ref(`users/${userId}`);
        ref.update(
           {industry:newIndustry}
        )
    }
    async updateEducation(newEducation){
        let userId = await this.getUserId();
        let ref = firebase.database().ref(`users/${userId}`);
        ref.update(
           {education:newEducation}
        )
    }
    async getAttribute(attribute) {
        let ref = firebase.database().ref(`users/${await this.getUserId()}`)
        let location = ref.child(attribute);
        return new Promise((resolve, reject) => {
        location.once("value", (data) => {
        resolve(data.val());
    });
});
}
}

class Accounts {

    signUpWithEmailPassword() {
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
      
      
      signInWithEmailPassword() {
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
            window.alert("errorMessage");
          });
      }
        //initialize variables for saveUser()
      
      
      
      signOut() {
        // [START auth_sign_out]
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          setTimeout(function(){location.href = "index.html"} , 100);
        }).catch((error) => {
          // An error happened.
        });
        // [END auth_sign_out]
      }
      
}

export {User, Accounts}