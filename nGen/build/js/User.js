class User{
    constructor(){

    }
    /**
     * 
     * @returns {String} of current 
     */
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
          });
      }
        //initialize variables for saveUser()
      
      saveUser(userName, userBday, userId, userRole, userIndustry, userEducation) {
        var userName = document.getElementById("userName").value;
        var userBday = document.getElementById("userBday").value;
        var userRole = document.getElementById("userRole").value;
        var userIndustry = document.getElementById("userIndustry").value;
        var userEducation = document.getElementById("userEducation").value;
        //let newKey = this.database.ref().push().key;
        firebase.database().ref(`users/${userId}/`).set({
            userId: userId,
            username: userName,
            birthday: userBday,
            userrole: userRole,
            industry: userIndustry,
            education: userEducation,
      
        });
        setTimeout(function(){location.href = "index.html"} , 3500);
      }
      
      
      // // async UserStateChecker(){
      //   var userId = await GetUserId();
      //   var userrole = await GetUserRole(userId);
      //   firebase.auth().onAuthStateChanged(function(user)
        
      //    {
      //     if (user) { 
      //     // User is signed in.
      //       console.log("there is a currently signed in user: " + userrole + " " + userId);           
      //       document.getElementById('login-button').style.visibility = 'hidden';                                                                                                          
      //     } else {
      //       console.log("there is no signed in user");
      //       document.getElementById('my-profile-button').style.visibility = 'hidden'; 
      //     }
          
      //     if (userrole =='Professional')  {
      //       document.getElementById('new-post').style.visibility = 'visible';
      //     }
      //     else if (userrole !== 'Professional'){
      //       document.getElementById('new-post').style.visibility = 'hidden';
      //     }
      
      //     if (userrole =='Moderator')  {
      //       document.getElementById('mod-tools').style.visibility = 'visible';
      //     }
      //     else if (userrole !== 'Moderator'){
      //       document.getElementById('mod-tools').style.visibility = 'hidden';
      //     }
      //   });
      // // }
      
      signOut() {
        // [START auth_sign_out]
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          setTimeout(function(){location.href = "index.html"} , 2500);
        }).catch((error) => {
          // An error happened.
        });
        // [END auth_sign_out]
      }
      
}
// document.body.onload = () => {Acct.UserStateChecker()};
// document.getElementById('signupbutton').onclick = () => {Acct.signUpWithEmailPassword()};
// document.getElementById('login-button').onclick = () => {Acct.signInWithEmailPasswordsignInWithEmailPassword()};
// document.getElementById('saveuser').onclick = () => {Acct.saveUser(userName, userBday, userId, userRole, userIndustry, userEducation)};
// document.getElementById('logout').onclick = () => {Acct.signOut()};
export {User, Accounts}