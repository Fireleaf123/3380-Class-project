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

export {User}