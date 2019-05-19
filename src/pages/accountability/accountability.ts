import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
/**
 * Generated class for the AccountabilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accountability',
  templateUrl: 'accountability.html',
})
export class AccountabilityPage {
	accountabilities: Array<any> = [];
	public rootDB : firebase.database.Reference = firebase.database();
	public userRef : firebase.database.Reference = firebase.database().ref('users');
	public requests: Array<any> = [];
	public requestRef: firebase.database.Reference = firebase.database().ref('chemistry/request');
	public defectiveItems: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
		console.log("succesful: "+ studentID);
		this.requestRef.orderByChild("user").equalTo(studentID).on('value', itemSnapshot => {
	    this.requests = [];
	    itemSnapshot.forEach( itemSnap => {
	    	if (itemSnap.val().status == "defective"){
		      	this.requests.push(itemSnap.val());
		     	return false;
		     }
	    });
	    console.log(this.requests)
	  });

	}).catch((message)=>{
		console.log("error: " + message);
	})

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountabilityPage');
  }

}
