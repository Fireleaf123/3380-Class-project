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
 
 // User First Name Validation

function checkUserFirstName(){
    var userFirstname = document.getElementById("userFirstName").value;
    var flag = false;
    if(userFirstname === ""){
        flag = true;
    }
    else{
        flag = false;
    }
}

// User Last Name Validation 

function checkUserSurname(){
    var userSurname = document.getElementById("userSurname").value;
    var flag = false;
    if(userSurname === ""){
        flag = true;
    }
    else{
        flag = false;
    }
}

// Username Validation

function checkUserName(){
    var userName = document.getElementById("userName").value;
    var flag = false;
    if(userName === ""){
        flag = true;
    }
    else{
        flag = false;
    }
}

// Email Validation 

function checkUserEmail(){
    var userEmail = document.getElementById("userEmail");
    var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userEmail.value.match(userEmailFormate)){
        flag = false;
    }
    else{
        flag = true;
}

// Password Validation

function checkUserPassword(){
    var userPassword = document.getElementById("userPassword");
    var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      
    var flag;
    if(userPassword.value.match(userPasswordFormate)){
        flag = false;
    }
    else{
        flag = true;
    }    
}


// User Creation in Firebase function


function signUp(){
    var userFirstName = document.getElementById("userFirstName").value;
    var userSurname = document.getElementById("userSurname").value;
    var userEmail = document.getElementById("userEmail").value;
    var userName = document.getElementById("userName").value;
    var userPassword = document.getElementById("userPassword").value;
    var userFirstNameFormate = /^([A-Za-z.\s_-])/;    
    var userSurnameFormate = /^([A-Za-z.\s_-])/; 
    var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var userPasswordFormate = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      

    var checkUserFirstNameValid = userFirstName.match(userFirstNameFormate);
    var checkUserSurnameValid = userSurname.match(userSurnameFormate);
    var checkUserEmailValid = userEmail.match(userEmailFormate);
    var checkUserPasswordValid = userPassword.match(userPasswordFormate);

    if(checkUserFirstNameValid == null){
        return checkUserFirstName();
    }
    else if(checkUserSurnameValid === null){
        return checkUserSurname();
    }
    else if(checkUserEmailValid == null){
        return checkUserEmail();
    }
    else if(checkUserPasswordValid == null){
        return checkUserPassword();
    }
    else{
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
            var user = firebase.auth().currentUser;
            var uid;
            if (user != null) {
                uid = user.uid;
            }
            var firebaseRef = firebase.database().ref();
            var userData = {
                userFirstName: userFirstName,
                userSurname: userSurname,
                userName: userName,
                userEmail: userEmail,
                userPassword: userPassword,
            }
            firebaseRef.child(uid).set(userData);
            swal('Your Account Created','Your account was created successfully, you can log in now.',
            ).then((value) => {
                setTimeout(function(){
                    window.location.replace("../index.html");
                }, 1000)
            });
        });
    window.location="index.html";
    }
}
}
