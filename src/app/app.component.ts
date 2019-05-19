import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './credentials';
import * as $ from "jquery";

import { HomePage, Profile } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AccountabilityPage } from '../pages/accountability/accountability';
import { LoginPage } from '../pages/login/login';
import { AddRequestModalPage } from '../pages/add-request-modal/add-request-modal';
import { NotificationPage } from '../pages/notification/notification';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public notifNumber;
  rootPage: any = LoginPage;

  pages: Array<{title: string,  rename: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Accountability',component: AccountabilityPage },
      { title: 'Notification',  component: NotificationPage }
    ];

  }

  initializeApp() {
    firebase.initializeApp(firebaseConfig);
    this.rootPage = LoginPage;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  menuOpened(){
    console.log("menu clickded");
    //var userId = firebase.auth().currentUser.uid;
          //var userId = "Ld2sYv_ohBWG4IDVBBY";
          var userId = "dBPA6yS7LMhdNHiQZaA79fyF1UM2";
          let requesting = new Promise((resolve, reject) =>{
            //console.log("HUY" + userId)
            var userRef = firebase.database().ref('users');

            userRef.child(userId).on('value', snapshot => {
            var user1 = {};
             user1.studentID = (snapshot.val() && snapshot.val().userID) || 'Anonymous';
             user1.name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
             //console.log(user1.studentID)
             if (user1.studentID == undefined){
                reject("studentID not defined")
              }else{
                resolve(user1.studentID, user1.name);
              }
            });
              
          })

          requesting.then((studentID, username)=>{
            var mynotifs = []
            //notifications = [];
            var notificationRef= firebase.database().ref('notification');

            notificationRef.child(studentID).orderByChild("status").equalTo("new").on('value', itemSnapshot => {
              itemSnapshot.forEach( itemSnap => {
                var notifKeyAndVal = itemSnap;
                mynotifs.push(notifKeyAndVal);
                //console.log(itemSnapshot.val());
              });
              console.log("notifs ko")
              console.log(mynotifs)
              var notifNumber = mynotifs.length;
              console.log(notifNumber)
              if (notifNumber > 0){
                $("#notifID").text(notifNumber);
                 setTimeout(function(){
               $("#badge").css("display", "inline");
                  
              }, 0);
              }else{
                setTimeout(function(){
               $("#badge").css("display", "none");
                  
              }, 0);
              }
            });
          });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }




 }
