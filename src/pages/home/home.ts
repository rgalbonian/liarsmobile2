import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { ModalController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public lab: string;
	public user = firebase.auth().currentUser;
	public userId: string;
	public studentID : string;
  	


public items: Array<any> = [];
public itemRef: firebase.database.Reference = firebase.database().ref('chemistry/inventory/metal');

public requests: Array<any> = [];
public requestRef: firebase.database.Reference = firebase.database().ref('chemistry/request');
public userRef : firebase.database.Reference = firebase.database().ref('users');





    constructor(
		    private navCtrl: NavController,
		    private fireStore: AngularFirestore,
		    public modalCtrl: ModalController
		  ) {
		 
		  }
	ionViewDidLoad() {
	var userId = firebase.auth().currentUser.uid;

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
	      this.requests.push(itemSnap.val());
	      return false;
	    });
	    console.log(this.requests)
	  });

	}).catch((message)=>{
		console.log("error: " + message);
	})

/*	  this.requestRef.orderByChild("userID").equalTo(this.studentID).on('value', itemSnapshot => {
	    this.requests = [];
	    itemSnapshot.forEach( itemSnap => {
	      this.requests.push(itemSnap.val());
	      return false;
	    });
	  });
*/
	  
}

  	getRequests(){

	  	this.requestRef.orderByChild("userID").equalTo(studentID).on('value', itemSnapshot => {
		    this.requests = [];
		    itemSnapshot.forEach( itemSnap => {
		      this.requests.push(itemSnap.val());
		      return false;
		    });
		  });
  	}

  	getStudentID(user: User){
	  	
         
		
  	}

  	printS(studentID){
  		console.log(studentID);
  	}

	ionViewCanEnter(): boolean {
		firebase.auth().onAuthStateChanged(function(user) {
		   if(user) {
		    console.log("login successful")
		      return true; // You are allowed to enter
		   }   
		   
		   console.log("not logged in")
   		return false;
   		});
}

	addRequest(){

	}

		
    presentProfileModal() {
	   let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
	   profileModal.present();
	 } 

	 openAddRequestModal(){
	 	const addRequestModal = this.modalCtrl.create("AddRequestModalPage")
		addRequestModal.present();
	 }

}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Profile {

	 constructor(params: NavParams) {
	   console.log('UserId', params.get('userId'));
	 }

}
