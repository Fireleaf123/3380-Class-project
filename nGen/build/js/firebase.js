class Firebase{
    constructor(){

    }
    getUserId(){
        return new Promise( (resolve,reject) => {
            firebase.auth().onAuthStateChanged( 
                resolve(firebase.auth().currentUser.uid)
            );
        })
    }
    writerUserData(child,data){
        let userId = await this.getUserId();
        let ref = firebase.database().ref(`users/${userId}`).child(child)
        ref.set(
           {data}
        )
    }
}

export {Firebase}
import {Firebase} from './firebase.js'
