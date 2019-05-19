import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import firebase from 'firebase';
/**
 * Generated class for the LoginPage2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage2Page {
	user = {} as User;
  
	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
	  }

  	ionViewDidLoad() {
	    console.log('ionViewDidLoad LoginPage2Page');
	  }

	presentLoginError(errormsg) {
	    let alert = this.alertCtrl.create({
	      title: 'Login Error!',
	      subTitle: errormsg,
	      buttons: ['Dismiss']
	    });
	    alert.present();
	  }
    async login(user: User){
    	console.log(this.user)
    	if (this.user.email == "" || this.user.password == "" ||this.user.email == undefined || this.user.password == undefined){
    		console.log("emtty")

    		this.presentLoginError("Please enter both email and password.");
    		return false;
    	}
    	try{
    		const result = await firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then( user => {
			    if (user) {
			    this.navCtrl.setRoot('HomePage');
			    	 return new Promise( (resolve, reject) => {
					      if (user) {

					      	var userID = firebase.auth().currentUser.uid;
					      	//var userID = "Ld2sYv_ohBWG4IDVBBY";
					      	//console.log("user id: "+userID)
				          	firebase.database().ref('users/' + userID).once('value').then(function(snapshot) {
						  	var name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
						  	var studentID = (snapshot.val() && snapshot.val().userID) || 'Anonymous';
					  		//console.log("insidefunc: " + studentID)
							user.studentID = studentID;
							});
					        
					        resolve(user);
					      } else {
					          reject(error);
					      }
					    });
			      
			  } else {
			    this.navCtrl.setRoot('LoginPage2Page');
			  }
    	});
		}catch(e){
		  console.log("catching")
		  this.presentLoginError(e.message);
		  }
  }


   


}
