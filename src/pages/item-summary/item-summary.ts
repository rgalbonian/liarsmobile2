import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ItemSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-summary',
  templateUrl: 'item-summary.html',
})
export class ItemSummaryPage {
public selectedItems:Array<any> = [];
request = {} as Request;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  	this.request = this.navParams.get('request')
  	this.selectedItems = this.request.items;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemSummaryPage');
  
  }

  closeItemSummary(){
  	this.view.dismiss(this.request);
  }

  	removeThisItem(item){
		var index = this.request.items.indexOf(item);
 
	    if (index > -1) {
	       this.request.items.splice(index, 1);
	    }
		console.log("item removed")
	}


}
