import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import firebase from 'firebase';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	user = {} as User;
  
	constructor( private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
	  }

  	ionViewDidLoad() {
	    console.log('ionViewDidLoad LoginPage');
	  }
    async login(user: User){
    	try{
    		const result = await this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then( user => {
			    if (user) {
			    this.navCtrl.setRoot('HomePage');
			    	 return new Promise( (resolve, reject) => {
					      if (user) {
					      	var userID = firebase.auth().currentUser.uid;

					      	console.log("user id: "+userID)
				          	firebase.database().ref('users/' + userID).once('value').then(function(snapshot) {
						  	var name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
						  	var studentID = (snapshot.val() && snapshot.val().userID) || 'Anonymous';
					  		console.log("insidefunc: " + studentID)
							user.studentID = studentID;
							});
					        
					        resolve(user);
					      } else {
					          reject(error);
					      }
					    });
			      
			  } else {
			    this.navCtrl.setRoot('LoginPage');
			  }
    	});
		}catch(e){
		  console.log("catching")
		  console.log(e)
		  }
  }


   


}
