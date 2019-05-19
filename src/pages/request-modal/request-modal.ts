import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController, AlertController, ActionSheetController   } from 'ionic-angular';
import firebase from 'firebase';
import * as $ from "jquery";
import { Request } from '../../models/user';
/**
 * Generated class for the RequestModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-modal',
  templateUrl: 'request-modal.html',
})
export class RequestModalPage {
 request = {} as Request;
 public defaultDate : string;
 	public rootDB : firebase.database.Reference = firebase.database();
	public proxyIDStatus = true;
  constructor(public actionSheetController: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, private view: ViewController, public modalCtrl: ModalController, private alertCtrl: AlertController, public toastController: ToastController) {
  	  	this.request = this.navParams.get('request')
       
       
  	  	$("#editRequest").css("display", "none");
  		$("#viewRequest").css("display", "inline");
  		
$("button.btn-2").css("display", "none");
  }

  ionViewDidLoad() {
      $("#origDate").text(this.formatTimestamp(this.request.requestNeeded));    
    var n = this.navParams.get('n');
       console.log(n, this.request.status)
    if (n == "notify" || this.request.status != "pending"){

        $("#more-btn").css("display", "none");
       }
    console.log('ionViewDidLoad RequestModalPage');
   // $("#chooseDate").val(this.defaultDate);
  }

  ionViewWillEnter(){
  this.request = this.navParams.get('request')
   	this.defaultDate = this.getOriginalDate(this.request.requestNeeded);


  }
  closeRequest(){
  	this.view.dismiss();
  }
  editRequest(){
    $("#more-btn").css("display", "none");
  	console.log(this.request)
  	if (this.request.status == "pending"){
	  	$("#editRequest").css("display", "inline");
	  	$("#viewRequest").css("display", "none");
	  	$("button.btn-2").css("display", "inline");
	  	$("button.btn-1").css("display", "none");
  	}else{
  		//alert


  		this.presentAlertPendingOnly();
  		console.log("noooooo")
  	}
  }
  cancelRequestCheck(){
  	if (this.request.status == "pending"){
	  	this.presentCancelConfirm();
  	}else{
  		this.presentAlertPendingOnly();
  		//console.log("noooooo")
  	}
  }
  cancelRequest(){
  	var requestID = this.request.requestID;
  	var cancelRef = this.rootDB.ref(""+ this.request.laboratory + "/request");
  	let cancellingItem = new Promise((resolve, reject) =>{

      cancelRef.orderByChild("requestID").equalTo(requestID).on('value', snapshot => {
          var reqKey = ""
          snapshot.forEach(function(childSnapshot) {
          	console.log(childSnapshot.key);
          	reqKey = childSnapshot.key;
          });
          
          resolve(reqKey);
        });
        
        
        
    })

    cancellingItem.then((reqKey) => {
    	let cancelling = this.rootDB.ref(""+ this.request.laboratory + "/request/"+reqKey);
    	//cancelling.remove();
    	this.request.status = "cancelled";
    	cancelling.update(this.request);
    	var action = "Request has been cancelled.";
    	this.updateRequestHistory(this.request.requestID, action);
    	this.navCtrl.popToRoot()
	    .then(() => this.navCtrl.first().dismiss());
	     this.deleteSuccess();
    	console.log("request removed");
    })
  }
  cancelEdit(){
  	$("#editRequest").css("display", "none");
  	$("#viewRequest").css("display", "inline");
  	$("button.btn-2").css("display", "none");
  	$("button.btn-1").css("display", "inline");
  }


  async editSuccess() {
    const toast = await this.toastController.create({
      message: 'Your request has been successfully edited.',
      duration: 2000
    });
    toast.present();
  }


  async deleteSuccess() {
    const toast = await this.toastController.create({
      message: 'Your request has been successfully deleted.',
      duration: 2000
    });
    toast.present();
  }
  saveEdit(){
  	console.log(this.request);
  	var requestID = this.request.requestID;
  	var cancelRef = this.rootDB.ref(""+ this.request.laboratory + "/request");
  	let savingItem = new Promise((resolve, reject) =>{

      cancelRef.orderByChild("requestID").equalTo(requestID).on('value', snapshot => {
          var reqKey = ""
          snapshot.forEach(function(childSnapshot) {
          	console.log(childSnapshot.key);
          	reqKey = childSnapshot.key;
          });
          
          resolve(reqKey);
        });
        })

    savingItem.then((reqKey) => {
    	let saving = this.rootDB.ref(""+ this.request.laboratory + "/request/"+reqKey);
    	saving.update(this.request);
    	console.log("request updated");
      this.editSuccess();
    	var action = "Edited request."
    	 this.updateRequestHistory(this.request.requestID,action)
    	$("#editRequest").css("display", "none");
  	$("#viewRequest").css("display", "inline");
  	$("button.btn-2").css("display", "none");
  	$("button.btn-1").css("display", "inline");
    })

  }
 getOriginalDate(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var month = a.getMonth();
  var day = a.getDate();
   var year = a.getFullYear();
   var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
   if (month.toString().length == 1){
   	month = "0" + month;
   }
   if (day.toString().length == 1){
   	day = "0" + day;
   }
   console.log(month, day, month.toString().length)
 var date = "" + year + "-" + month + "-" + day + "T" + hour + ":" + min + "Z";
console.log(date);
}

	addNewItems(){
	const itemsModal = this.modalCtrl.create("ItemsPage", {request: this.request, transact: "editRequest"})
        itemsModal.present();
	}

	removeThisItem(item){
		var index = this.request.items.indexOf(item);
 
	    if (index > -1) {
	       this.request.items.splice(index, 1);
	    }
		console.log("item removed")
	}



	presentAlertPendingOnly() {
	  let alert = this.alertCtrl.create({
	    title: 'Request in Process!',
	    subTitle: 'Error! You can only edit or cancel pending requests.',
	    buttons: ['Dismiss']
	  });
	  alert.present();
	}

	presentAlertProxyError() {
	  let alert = this.alertCtrl.create({
	    title: 'Wrong format!',
	    subTitle: 'Please enter a valid student number of person authorized to claim.',
	    buttons: ['Dismiss']
	  });
	  alert.present();
	}

	presentSaveConfirm() {
	console.log(this.proxyIDStatus)
  	if (this.proxyIDStatus == false){
  		console.log("")
  		this.presentAlertProxyError();
  		return false;
  	}
	  let alert = this.alertCtrl.create({
	    title: 'Confirm',
	    message: 'Confirm changes to request?',
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Confirm',
	        handler: () => {
	        	this.saveEdit();
	          console.log('Buy clicked');
	        }
	      }
	    ]
	  });
	  alert.present();
	}

	presentCancelConfirm() {
	  let alert = this.alertCtrl.create({
	    title: 'Confirm',
	    message: 'Are you sure you want to cancel this request?',
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Confirm',
	        handler: () => {
	        	this.cancelRequest();
	        }
	      }
	    ]
	  });
	  alert.present();
	}

	  //update request history
 updateRequestHistory(historyID, action){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	
	var database = firebase.database().ref(this.request.laboratory);
	console.log("hehehe "+uid)
	//showNotification(action)
  var lab = this.request.laboratory;
	database.child("/history/request").orderByChild("historyID").equalTo(historyID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					console.log("hehehe hist");
					var updateThisChild = childSnapshot.key;

					var timeStamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
					var dateParts = (timeStamp.toString()).split(" ");
					firebase.database().ref('users').child(uid)
				    .once('value')
				    .then(function(snapshot) {
				      var name = snapshot.val().name;
				      var uname = snapshot.val().userID;
					var additionalAction = {
							"user": {
								"userID" : uid,
								"name" : name
							},
							"action": action,
							"timeStamp" : new Date().getTime()
					};			
					firebase.database().ref(""+lab+"/history/request/"+updateThisChild+"/actions").push(additionalAction);
				    });
					return true;
			});
	});
}

  
	async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [ {
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.editRequest();
          console.log('Share clicked');
        }
      },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.cancelRequestCheck();
          console.log('Delete clicked');
        }
      },
        {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


    viewRequestHistory(){
      const historyModal = this.modalCtrl.create("RequestHistoryPage", {request: this.request})
        historyModal.present();
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


$(document).ready(function(){

console.log("document is ready")
console.log("heloooo ready na me")
$('#auth2').on('keypress keydown keyup',function(){
      var $regexunit=/^201[0-9]{6}$/;
             if (!$(this).val().match($regexunit) && $(this).val().length != 0) {

              $("#auth-error2").html("Enter a valid student number with format: 201XXXXXX.");
              console.log("ERROR AUTH2")
              this.proxyIDStatus = false;
              console.log(this.proxyIDStatus);
              $("#auth2").css("border-color", "red");
             }
           else{
           	this.proxyIDStatus = true;
                $("#auth-error2").html("");
                $("#auth2").css("border-color", "green");
               }
         });

         });


