import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the RequestSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-summary',
  templateUrl: 'request-summary.html',
})
export class RequestSummaryPage {
	request = {} as Request;
	public rootDB : firebase.database.Reference = firebase.database();

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public toastController: ToastController) {
  	  this.request = this.navParams.get('request');
  	  console.log(this.request)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestSummaryPage');
  }

  editRequest(){
  	this.view.dismiss()
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your request has been submitted.',
      duration: 2000,
      color: "primary"
    });
    toast.present();
  }

  saveRequestToDB(){
  	var requestRef = this.rootDB.ref(""+ this.request.laboratory + "/request");
  	let savingItem = new Promise((resolve, reject) =>{
      requestRef.orderByKey().limitToLast(1).on('value', snapshot => {
          var requestID = ""
          snapshot.forEach(function(childSnapshot) {
          	console.log(childSnapshot.val());
          	var lastID = childSnapshot.val().requestID ;
          	var newID = lastID.slice(3, );
          	var myID = parseInt(newID) + 1;
            requestID = lastID.slice(0, 3) + myID;
            console.log(requestID)
          });
          
          resolve(requestID.toString());
        });
        
        
        
    })

    savingItem.then((requestID) => {
    console.log(requestID)
    let savingToDB = new Promise((resolve, reject) =>{
    

    //console.log("this is the request roxy id")
    //console.log(this.request.proxyID);
    if (this.request.proxyID == undefined){
    	this.request.proxyID = " ";
    }
    this.request.details = "";

    this.request.requestID = requestID;
      if (this.request.requestID != undefined){
      	resolve();

      }        
    })

     savingToDB.then(() => {
      this.updateRequestHistory(this.request.requestID, this.request.laboratory)
      delete this.request.laboratory;
      var addRequest = requestRef.push();

     
	    addRequest.set(this.request);
	    this.presentToast();
	    console.log("Request added");
	    this.navCtrl.popToRoot()
	    .then(() => this.navCtrl.first().dismiss());
	      })
     })
       
    
  }

  closeSummary(){
  		this.navCtrl.popToRoot()
	    .then(() => this.navCtrl.first().dismiss());
	      
  }



  //update request history
 updateRequestHistory(historyID, lab){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	//asume lab = chemistry
	

	console.log("hehehe "+uid)
	
	var user = this.navParams.get('user');
	
	var newHist = this.rootDB.ref("" + lab +  "/history/request").push();
	var timeStamp = new Date().getTime();
	var actions = {
		0: {
			"action": "Request created.",
			"timeStamp": timeStamp,
			"user": {
				"name": user.name,
				"userID": user.studentID
			}
		}
	}
	var data = {
		"historyID": historyID,
		"actions":actions
	}

	newHist.set(data);
	console.log("new hist id created")
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
