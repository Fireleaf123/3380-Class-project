function saveUser(userName, userBbday, userId) {
    var userId = firebase.auth().currentUser.uid;
    var userName = document.getElementById("userName").value;
    var userBday = document.getElementById("userBday").value;
    //let newKey = this.database.ref().push().key;
    firebase.database().ref(users/${userId}/).set({
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
