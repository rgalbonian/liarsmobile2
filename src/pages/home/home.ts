import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import firebase from 'firebase';
import { ModalController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { User, Request } from '../../models/user';
import { LoginPage } from '../login/login';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public lab: string;
	public userId: string;
	public studentID : string;
  	user1 = {} as User;
  	request1 = {} as Request;

public items: Array<any> = [];

public requests: Array<any> = [];
public chemistryRef: firebase.database.Reference = firebase.database().ref('chemistry/request');
public biologyRef: firebase.database.Reference = firebase.database().ref('biology/request');
public userRef : firebase.database.Reference = firebase.database().ref('users');
public childChangeChem;
public childChangeBio;
public notifNumber = 0;
	public notificationRef: firebase.database.Reference = firebase.database().ref('notification');


    constructor(
		    private navCtrl: NavController,
		    public modalCtrl: ModalController,
		    public events: Events,
		    public actionSheetController: ActionSheetController,
		    private alertCtrl: AlertController,
		     public toastController: ToastController
		  ) {
		 	console.log("constructor")
		  }
	/*
	ionViewCanEnter(): boolean {
		//console.log("ion view can enter")
	    if(firebase.auth().currentUser == null){
	    	console.log("User not logged in.")
	    	setTimeout(() => this.navCtrl.setRoot('LoginPage'), 0);
	    	//this.navCtrl.getRootNav().setRoot('LoginPage');
	        //   this.navCtrl.setRoot('LoginPage');

	      return false;
	    } else {
	    	console.log("User is already logged in.")
	      return true;

	    }
	  }
*/
		  ionViewWillLeave(){
		  	this.chemistryRef.off('child_changed', this.childChangeChem);
		//  	console.log("leavinggg")
		  	this.biologyRef.off('child_changed', this.childChangeBio);
		  //	console.log("leavinggg")
		  }

	

	ionViewDidLoad() {
	console.log("did load")
		/*this.events.subscribe('newNotif', () => {
	    $("#notify").css("visibility", "visibile");
	  });
/*/
	//var userId = firebase.auth().currentUser.uid;
	//var userId = "Ld2sYv_ohBWG4IDVBBY";
	var userId = "dBPA6yS7LMhdNHiQZaA79fyF1UM2";
	let requesting = new Promise((resolve, reject) =>{
		//console.log("HUY" + userId)
		this.userRef.child(userId).on('value', snapshot => {
	   this.user1.studentID = (snapshot.val() && snapshot.val().userID) || 'Anonymous';
	   this.user1.name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
	   //console.log(this.user1.studentID)
	   if (this.user1.studentID == undefined){
	  		reject("studentID not defined")
	  	}else{
	  		resolve(this.user1.studentID, this.user1.name);
	  	}
	  });
	  	
	})

	requesting.then((studentID, username)=>{
		var mynotifs = []
		//this.notifications = [];
		this.notificationRef.child(studentID).orderByChild("status").equalTo("new").on('value', itemSnapshot => {
			itemSnapshot.forEach( itemSnap => {
				var notifKeyAndVal = itemSnap;
				mynotifs.push(notifKeyAndVal);
				//console.log(itemSnapshot.val());
			});
			console.log(mynotifs)
			if (mynotifs.length > 0){
				
				setTimeout(function(){
					$("#notify").css("display", "inline");
		  			$("#loadingscreen").css("display", "none")
		  		}, 0);
			}else{
				setTimeout(function(){
			
		  		console.log("bitch")
		  		setTimeout(function(){
		  		 	$("#notify").css("display", "none");
		  			$("#loadingscreen").css("display", "none")
		  		}, 0);
		  		
		  }, 0);
			}
		});
/*
		//console.log("adding notif listener")
		this.childChangeChem = this.chemistryRef.on("child_changed", function notif(snapshot, this) {
		  var changedRequest = snapshot.val();
		  setTimeout(function(){
			 $("#notify").css("display", "inline");
		  		console.log("bitch")
		  		$("#loadingscreen").css("display", "none")
		  }, 0);
		  console.log("Edited request no. " + changedRequest.requestID);
		  if (changedRequest.user == studentID){
			  	//console.log("udating")
			  	var notificationRef = firebase.database().ref('notification/' + studentID);
			
			notificationRef.push().set({
				"request" : changedRequest,
				"status" : "new"
			});
			  }
		});

		this.childChangeBio = this.biologyRef.on("child_changed", function notif(snapshot) {
		  var changedRequest = snapshot.val();
		  setTimeout(function(){
			 $("#notify").css("display", "inline");
		  		console.log("bitch")
		  		$("#loadingscreen").css("display", "none")
		  }, 0);

			console.log("Edited request no. " + changedRequest.requestID);
		  if (changedRequest.user == studentID){
			  	//console.log("udating")
			  	var notificationRef = firebase.database().ref('notification/' + studentID);
			
			notificationRef.push().set({
				"request" : changedRequest,
				"status" : "new"
			});
			  }
		});*/

		//console.log("succesful: "+ studentID);
		this.chemistryRef.orderByChild("user").equalTo(studentID).on('value', itemSnapshot => {
	    this.requests = [];
	    itemSnapshot.forEach( itemSnap => {
	    	this.request1 = itemSnap.val();
	    	this.request1.laboratory = "chemistry";
	    	
	    	if (this.request1.status == "cancelled"){
	    		console.log("Cancelled request no. "+ this.request1.requestID)
	    	}
	    	else{
	    		this.requests.push(this.request1);	
	    	}
	    	
	      
	      return false;
	   
	    });

	    this.biologyRef.orderByChild("user").equalTo(studentID).on('value', itemSnapshot => {
	    itemSnapshot.forEach( itemSnap => {
	    	this.request1 = itemSnap.val();
	    	this.request1.laboratory = "biology";
	      if (this.request1.status == "cancelled"){
	    		console.log("Cancelled request no. "+ this.request1.requestID)
	    	}
	    	else{
	    		this.requests.push(this.request1);	
	    	}
	    	$("#loadingscreen").css("display", "none")
	      return false;
	    });
	});
	   this.requests.sort(
		   function(a, b) {
		      return a.requestSent > b.requestSent ? 1 : -1;
		   });
		this.requests = this.requests.reverse();
		$("#loadingscreen").css("display", "none")
	   // console.log("requests!!1")
	    //console.log(revReq)
	  });

	}).catch((message)=>{
		console.log("error: " + message);
	})


	  
}
  	

	addRequest(){

	}

	openOptions(){
		this.presentOptions();
	}

	savepassword(newPassword){
		let user = firebase.auth().currentUser;
		//let newPassword = getASecureRandomPassword();

		user.updatePassword(newPassword).then(() => {
		  // Update successful.
		  console.log("password changed")
		}, (error) => {
			console.log(error)
		  // An error happened.
		});
	}
	changepassword() {
    let alert = this.alertCtrl.create({
      title: 'Enter new password',
      inputs: [
        {
          name: 'newPassword',
          id: 'newPassword'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            	this.entercurrentPassword(data.newPassword);
          }
        }
      ]
    });
    alert.present();
}
	entercurrentPassword(newPassword) {
    let alert = this.alertCtrl.create({
      title: 'Enter current password',
      inputs: [
        {
          name: 'currentPassword',
          id: 'currentPassword'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
          	let user = firebase.auth().currentUser;
          	console.log( data.currentPassword, newPassword)
          	var currentPassword = data.currentPassword;
          	var reauthenticate = (currentPassword) => {
			  var user = firebase.auth().currentUser;
			  var cred = firebase.auth.EmailAuthProvider.credential(
			      user.email, currentPassword);
			  return user.reauthenticateWithCredential(cred);
			}
			var changePassword = (currentPassword, newPassword) => {
				console.log("inside changePassword")
			  reauthenticate(currentPassword).then(() => {
			    var user = firebase.auth().currentUser;
			    user.updatePassword(newPassword).then(() => {
			      console.log("Password updated!");
			      const toast = this.toastController.create({
			      message: 'Password has been successfully updated!',
			      duration: 2000
			    });
			    toast.present();

			    }).catch((error) => { console.log(error); this.errorWrongpassword(); });
			  }).catch((error) => { console.log(error);this.errorWrongpassword(); });
			}
          	
          	changePassword(currentPassword, newPassword);
          }
        }
      ]
    });
    alert.present();
}


	  errorWrongpassword() {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'Wrong Password',
      buttons: ['Dismiss']
    });
    alert.present();
  }
	async presentOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Account',
      buttons: [ {
        text: 'Log Out',
        handler: () => {
          this.logOut();
          console.log('Logout');
        }
      },{
        text: 'Change password',
        handler: () => {
          this.changepassword();
        }
      },
        {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  	  logOut(){
    try {
      firebase.auth().signOut();
      this.navCtrl.push(LoginPage);

         // native.setRoot(LoginPage);

    } catch (e){
     // an error
     console.log(e)
    } 

  }


    presentProfileModal() {
	   let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
	   profileModal.present();
	 } 

	 openAddRequestModal(){
	 //console.log("HELOOO: " + this.studentID)
	 //console.log(this.user1)
	 	const addRequestModal = this.modalCtrl.create("AddRequestModalPage", {user: this.user1})
		addRequestModal.present();
	 }

	 openRequest(req){

	 	const openModal = this.modalCtrl.create("RequestModalPage", {request: req})
		openModal.present();
	 }

	formatTimestamp(UNIX_timestamp){
		  var a = new Date(UNIX_timestamp);
		  //console.log(UNIX_timestamp + "  " + a)
		  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var meridian = 'AM';
		  	if(hour>=13){
		  		hour = hour-12;
		  		meridian = 'PM';
		  	}
		  	else if(hour==0){
		  		hour = 12;
		  		meridian = 'AM';
		  	}else{
		  		meridian = 'AM'
		  	}
		  	if(min < 10){
		  		//min = "0" + min;
		  	var time =  month + ' ' + date +', ' + year + '   ' + hour + ':0' + min + ' ' + meridian ;
		  	}else{
		  		 var time =  month + ' ' + date +', ' + year + '   ' + hour + ':' + min + ' ' + meridian ;

		  	}
		  return time;
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
