import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import firebase from 'firebase';
import * as $ from "jquery";
import { Request } from '../../models/user';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

	public notifications: Array<any> = [];
	public chemistryRef: firebase.database.Reference = firebase.database().ref('chemistry/request');
	public biologyRef: firebase.database.Reference = firebase.database().ref('biology/request');
  	request = {} as Request;
	public notificationRef: firebase.database.Reference = firebase.database().ref('notification');
public userRef : firebase.database.Reference = firebase.database().ref('users');

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    var userId = "dBPA6yS7LMhdNHiQZaA79fyF1UM2";

	let requesting = new Promise((resolve, reject) =>{
		console.log("HUY" + userId)
		this.userRef.child(userId).on('value', snapshot => {
	   this.studentID = (snapshot.val() && snapshot.val().userID) || 'Anonymous';
	   console.log(this.studentID)
	   if (this.studentID == undefined){
	  		reject("studentID not defined")
	  	}else{
	  		resolve(this.studentID);
	  	}
	  });
	  	
	})

	requesting.then((studentID)=>{
		var mynotifs = []
		//this.notifications = [];
		var myn = []
		console.log("testing")
		console.log(myn)
		this.notificationRef.child(studentID).on('value', itemSnapshot => {
			
			itemSnapshot.forEach( itemSnap => {
				var notifKeyAndVal = itemSnap;
				myn.push(itemSnap.val())
				mynotifs.push(notifKeyAndVal);
				console.log("item");
			});
			console.log("being called")
			console.log(mynotifs)
			console.log(myn)

			this.notifications = mynotifs.reverse();

		});

	}).catch((message)=>{
		console.log("error: " + message);
	})
  }



	 openRequest(notif){
	 	
	 	var notifVal = notif.val();
	 	var oldnotif = firebase.database().ref('notification/'+ notifVal.request.user + "/" + notif.key);
		notifVal.status = "old";		 		
	 	oldnotif.update(notifVal);
	 	
	 	const openModal = this.modalCtrl.create("RequestModalPage", {request: notifVal.request, n : "notify"})
		openModal.present();
	 }

}
