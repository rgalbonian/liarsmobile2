import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, ViewController, Events , AlertController} from 'ionic-angular';
import * as $ from "jquery";
import { Request, Item } from '../../models/user';
import firebase from 'firebase';

/**
 * Generated class for the ItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})

export class ItemsPage {
	itemsSelected :Array<any> = [];
	item = {} as Item;
	request = {} as Request;
  public transact:string;
	itemsInventory :Array<any> = [];
	loadedItemsInventory :Array<any> = [];
	public rootDB : firebase.database.Reference = firebase.database();
  currentItem = {} as Item;
  categories : Array<any> =[];
  itemsID : Array<any> =[];
  public userRef : firebase.database.Reference = firebase.database().ref('users');
  public requestRef: firebase.database.Reference = firebase.database().ref('chemistry/request');
  public quantityData : string;
  public amountData : string;
  public unitData : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public action: ActionSheetController, public modalCtrl: ModalController, public events: Events, private view: ViewController,  private alertCtrl: AlertController) {
    this.request = this.navParams.get('request')

    this.transact = this.navParams.get('transact');
    console.log(this.transact)
    if ( this.transact == "addRequest"){
      this.request.items = [];
      this.itemsID = [];
    }else{
      this.itemsID = [];
      this.request.items.forEach((it)=>{
        this.itemsID.push(it.itemID);
      })
    }
	  	
  }


  pushingItem(item){
    this.itemsSelected.push(item);
        console.log("item added")
        console.log(this.itemsSelected);
        this.events.unsubscribe('addingItem');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');

  }
  ionViewWillEnter(){
  	this.getInventory();
    


    
  }
  showSummary(){
  	
  		console.log("show summary");
  		console.log("received info: " + this.request.dateNeeded + this.request.proxyID + this.request.laboratory );
      this.request.items.forEach(function(item){
          console.log(item.name);
      });
  }

  filterList(evt) {
  	console.log("filterlist");
	this.initializeInventory();

	const searchTerm = evt.srcElement.value;

	if (!searchTerm) {
	return;
	}
	//console.log(this.itemsInventory);
	this.itemsInventory = this.itemsInventory.filter(currentItem => {
	if (currentItem.name && searchTerm) {
		if (currentItem.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
		return true;
		}
		return false;
	}
	});
}

  getInventory(){
    var laboratory = this.navParams.get('request').laboratory;
    var cat = this.categories;
    this.itemsInventory = [];

    let gettingItems = new Promise((resolve, reject) =>{
      this.rootDB.ref("" + laboratory + "/inventory").on('value', snapshot => {
          snapshot.forEach(function(childSnapshot) {
            //console.log(childSnapshot.key);
            cat.push(childSnapshot.key)
             
          });
          //console.log(cat);
          resolve(cat);
        });
        
        
        
    })

    gettingItems.then((categories) => {
      //console.log("adding items from "+ categories)
      for (var i = categories.length - 1; i >= 0; i--) {
        //console.log(this.loadedItemsInventory);
        this.rootDB.ref("" + laboratory +"/inventory/" + categories[i]).on('value', itemSnapshot => {
                this.itemsInventory = [];
                itemSnapshot.forEach( itemSnap => {
                  this.itemsInventory.push(itemSnap.val());
                  return false;
                });
                //console.log(this.itemsInventory)
                this.loadedItemsInventory = this.loadedItemsInventory.concat(this.itemsInventory);
            });
        
        }
      })
  }

  initializeInventory(){
  	this.itemsInventory = this.loadedItemsInventory;
  }

  addItem(chooseItem){	
  console.log("adding item...")
  console.log(chooseItem.itemID)
  console.log(this.itemsID)
  	if (this.itemsID.includes(chooseItem.itemID)){
      this.presentAlertItemAlreadyAdded();
      return false;
    }
    console.log(chooseItem)
    if (chooseItem.category == "glassware" || chooseItem.category == "culture"){
      this.presentPromptQuantity(chooseItem)
    }else{
      this.presentPromptAmount(chooseItem)
    }
   // console.log("returned- "+ this.quantityData);
  	/*const quantityModal = this.modalCtrl.create("QuantitySelectorPage", {item: chooseItem, request: this.request});
		quantityModal.present();

    quantityModal.onDidDismiss(data => {
     console.log("MYDATA: ");
     this.request = data;
     console.log(this.request)
    
   });*/
  }

  addRequest(){
    if (this.request.items.length == 0){
      this.presentAlertNoItems();
    }else{
    
    console.log("Request Summary")
    
    var datenow = new Date().getTime();
    this.request.requestSent = datenow;
    this.request.status = "pending";
    console.log(this.request)
      const requestSummaryModal = this.modalCtrl.create("RequestSummaryPage", { request: this.request, user: this.navParams.get('user')});
    requestSummaryModal.present();
  }
}

  editRequest(){
    this.view.dismiss();
  }

  cancelAddItems(){
    this.view.dismiss(this.request);
  }

  presentAlertNoItems() {
    let alert = this.alertCtrl.create({
      title: 'No items selected!',
      subTitle: 'Please select items to be requested.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentAlertItemAlreadyAdded() {
    let alert = this.alertCtrl.create({
      title: 'Item already added!',
      subTitle: 'Please review selected items at the bottom of the screen to remove item or edit value.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentAlertInvalidQuantity() {
    let alert = this.alertCtrl.create({
      title: 'Invalid quantity!',
      subTitle: 'Please enter a valid quantity.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showSelectedItems(){
    const itemsSummaryModal = this.modalCtrl.create("ItemSummaryPage", { request: this.request});
    itemsSummaryModal.present();
    itemsSummaryModal.onDidDismiss(data => {
     
     this.request = data;
     console.log(this.request)
    this.itemsID = [];
      this.request.items.forEach((it)=>{
        this.itemsID.push(it.itemID);
      });
   });
  }


  presentPromptQuantity(item) {
    let alert = this.alertCtrl.create({
      title: 'Select Value',
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Enter quantity.',
          id: 'quantityID',
          type: 'number'
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
            
              console.log(data.quantity);
              this.quantityData = data.quantity;
              if (this.verifyQuantity(this.quantityData, item)){
                  console.log("quantity acceted")
               
              }else{
                console.log("error quantity");
                return false;
              }
              
              //return data.quantity;
              // logged in!
            
          }
        }
      ]
    });
    alert.present();
}



verifyQuantity(quantity, item){
  
  var $regexunit=/^[0-9]+$/;
  if (!quantity.match($regexunit) || quantity == 0 || quantity.length == 0 ) {
    this.presentAlertInvalidQuantity();
    return false;
  }else{
    item.quantity = quantity;

    this.request.items.push(item);
    this.itemsID.push(item.itemID);
    console.log(this.request)
    return true;
  }
}


  presentAlertInvalidAmount() {
    let alert = this.alertCtrl.create({
      title: 'Invalid amount!',
      subTitle: 'Please enter a valid amount.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showSelectedItems()


  presentPromptAmount(item) {
    let alert = this.alertCtrl.create({
      title: 'Select value in ' + item.unit.toUpperCase(),
      inputs: [
        {
          name: 'amount',
          placeholder: 'Enter amount.',
          type: 'number'
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
            
              console.log(data.amount);
              this.amountData = data.amount;
              if (this.verifyAmount(this.amountData, item)){
                  console.log("amount acceted")
                  
              }else{
                console.log("error amount");
                return false;
              }
              
              //return data.amount;
              // logged in!
            
          }
        }
      ]
    });
    alert.present();
}



verifyAmount(amount, item){
  var $regexamount = /^\d*\.?\d*$/;

  if (!amount.match($regexamount) || amount == 0 || amount.length == 0 ) {
    this.presentAlertInvalidAmount();
    return false;
  }else{
    item.amount = amount;
    console.log(item)
    this.request.items.push(item);
    this.itemsID.push(item.itemID);
    return true;
  }
}



}


