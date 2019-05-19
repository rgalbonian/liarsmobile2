import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ModalController , NavController} from 'ionic-angular';
import { Request } from '../../models/user';
import { Events } from 'ionic-angular';
import * as $ from 'jquery'

/**
 * Generated class for the AddRequestModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-request-modal',
  templateUrl: 'add-request-modal.html',
})
export class AddRequestModalPage {
	request = {} as Request;
  public time: string;
  public date:string;
 public proxyIDStatus;
  constructor(private navCtrl: NavController, public events: Events,  public modalCtrl: ModalController, public navParams: NavParams, private view: ViewController, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRequestModalPage');
  }

  cancelAddRequest(){
  this.view.dismiss();
  }


  addRequestItems(request: Request){
  		//this.getRequestBasic(request);
  		console.log("publishing request-created")
  		var user = this.navParams.get('user');
      var studentID =user.studentID;
      this.request.user = studentID;
      console.log(this.request)

      if (this.request.laboratory == undefined || this.request.requestNeeded == undefined){

        this.presentAlertMissingDetails();
      }else{
        if (this.request.proxyID != undefined){


            var $regexunit=/^201[0-9]{6}$/;
            var myvar = this.request.proxyID.toString();
             if (!myvar.match($regexunit) && myvar.length != 0) {
              console.log(this.proxyIDStatus)
              this.presentAlertInvalidID();
              return false;
             }
          }
        var date = new Date(this.request.requestNeeded);
        var timestamp = date.getTime();
        //var date = this.request.requestNeeded.getTime();
      //var datum = Date.parse(this.request.requestNeeded);

     // console.log(datum/1000)
     // var date2 = datum/1000;
      this.request.requestNeeded = timestamp;
     // this.request.proxyID = 
    
        const itemsModal = this.modalCtrl.create("ItemsPage", {request: this.request, transact: "addRequest", user: user})
        itemsModal.present();

      }

      

		
  }

  presentAlertMissingDetails() {
    let alert = this.alertCtrl.create({
      title: 'Missing Details!',
      subTitle: 'Please select a laboratory and date.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentAlertInvalidID() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Student Number!',
      subTitle: 'Please enter student number in correct format. Example: 201511503',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentSaveConfirm() {
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


}



$(document).ready(function(){

console.log("document is ready")
$('#auth').on('keypress keydown keyup',function(){
      var $regexunit=/^201[0-9]{6}$/;

             if (!$(this).val().match($regexunit) && $(this).val().length != 0) {
              this.proxyIDStatus = false;
              $("#auth-error").html("Enter a valid student number with format: 201XXXXXX.");
             }
           else{
            this.proxyIDStatus = true;
                $("#auth-error").html("");
               }
               console.log(this.proxyIDStatus)
         });

         });