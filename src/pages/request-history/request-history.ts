import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
import firebase from 'firebase';
/**
 * Generated class for the RequestHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-history',
  templateUrl: 'request-history.html',
})
export class RequestHistoryPage {
 request = {} as Request;
	history :Array<any> = [];
	public rootDB : firebase.database.Reference = firebase.database();

  constructor(public navCtrl: NavController, public navParams: NavParams,  private view: ViewController) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestHistoryPage');
  this.request = this.navParams.get('request');
  console.log(this.request)
  	var histDB = firebase.database().ref("" + this.request.laboratory + "/history/request");
  	histDB.orderByChild("historyID").equalTo(this.request.requestID).on('value', hist => {
                hist.forEach( itemSnap => {
                	this.history = itemSnap.val().actions
                });
            });
  	console.log(this.history)
  }

  closeHistory(){
  	this.view.dismiss();
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
