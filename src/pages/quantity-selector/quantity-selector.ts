import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import { Item } from '../../models/user';
import * as $ from "jquery";

/**
 * Generated class for the QuantitySelectorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quantity-selector',
  templateUrl: 'quantity-selector.html',
})
export class QuantitySelectorPage {
	item = {} as Item;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public modalCtrl: ModalController, private view: ViewController) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuantitySelectorPage');
  }
  ionViewWillEnter(){
  



  	this.item = this.navParams.get('item');
  	if (this.item.category == "glassware"){
  		console.log("it's a glassware");
  		$("#quantity-item").css("display", "block");
  		$("#amount-item").css("display", "none");
  		console.log("quan selector ready")
		 var $regexunit=/^[0-9]+$/;
	    $('#quantity').on('keypress keydown keyup',function(){

	             if (!$(this).val().match($regexunit) || $(this).val() == 0 ) {
	              $("#error-quan").html("Please enter a valid quantity.");
	             }
	           else{
	                $("#error-quan").html("");
	               }
	         });
  	}
  	else{
  	$("#quantity-item").css("display", "none");
  		$("#amount-item").css("display", "block");
  		    var $regexamount = /^\d*\.?\d*$/;

		    $('#amount').on('keypress keydown keyup',function(){
		    console.log("bitch why")
             if (!$(this).val().match($regexamount) || $(this).val() == 0 ) {
              $("#error-amount").html("Please enter a valid amount.");
             }
           else{
                $("#error-amount").html("");
               }
         });
  		
  	console.log("not a glassware");
  	}
  }
  	cancelItem(){
  		this.view.dismiss(this.navParams.get('request'));
  	}
	addItemQuantity(){
		var newItem = this.navParams.get('item');
		var request = this.navParams.get('request');
		console.log(request);
		if (request.items == undefined){
			request.items = []
		}
		var myItems = request.items.slice();

		if (newItem.category == "glassware"){
			if (newItem.quantity > 0){
				console.log("current Items before push")
				console.log(request.items);
				myItems.push(newItem);
				request.items = myItems;
				console.log("publishing");
				this.view.dismiss(request);
			}else{
				var alertMessage = "Invalid quantity!"
		        const alertModal = this.modalCtrl.create("AlertModalPage", {alertMessage: alertMessage})
		        alertModal.present();
			}
		}else{
			if (newItem.amount > 0){
				console.log("current Items before push")
				console.log(request.items);
				myItems.push(newItem);
				request.items = myItems;
				console.log("publishing");
				this.view.dismiss(request);
			}else{
				var alertMessage = "Invalid amount!"
		        const alertModal = this.modalCtrl.create("AlertModalPage", {alertMessage: alertMessage})
		        alertModal.present();
			}
		}

		


	}


	
}

$(document).ready(function(){

});