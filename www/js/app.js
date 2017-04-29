// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngTwitter', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('PlayData', function($http) {

  return $http.get('test.json');

})

.factory('PlayDataFlat', function($http) {

  return $http.get('test0.json');

})


.controller('TodoCtrl', function($scope, $http, PlayData, PlayDataFlat, $ionicPopup, $timeout, $ionicPlatform, $twitterApi, $cordovaOauth, $localStorage) {

    console.log("start " + $localStorage.success);

    var selectedPlay="";
    var selectedPublicPlay="";
    var selectedFormation="";
    var status="";
    var yards=0;
    var notes="";
    $scope.playListChoice="false";

    //variables to be set from local storage assuming the value isn't null
    if ($localStorage.yards == null || $localStorage.yards == '') {
        $localStorage.yards=0;
    }
    $scope.yardsTotal=$localStorage.yards;
    total=$scope.yardsTotal;

    if ($localStorage.failed == null || $localStorage.failed == '') {
        $localStorage.failed=0;
    }
    $scope.failedPlays=$localStorage.failed;

    if ($localStorage.penalties == null || $localStorage.penalties == '') {
        $localStorage.penalties=0;
    }
    $scope.penaltyCount=$localStorage.penalties;

    if ($localStorage.averageYards == null || $localStorage.averageYards == '') {
        $localStorage.averageYards=0;
    }
    $scope.averageYards=$localStorage.averageYards;

    if ($localStorage.success == null || $localStorage.success == '') {
        $localStorage.success=0;
    }
    $scope.successfulPlays=$localStorage.success;

    if ($localStorage.playsMadeLocal == null || $localStorage.playsMadeLocal == '') {
        $localStorage.playsMadeLocal=[];
    }

    $scope.playsMade=$localStorage.playsMadeLocal;

    if ($localStorage.runCountSuccess == null || $localStorage.runCountSuccess == '') {
        $localStorage.runCountSuccess=0;
    }

    $scope.runCountSuccess=$localStorage.runCountSuccess;

    if ($localStorage.runCountFailed == null || $localStorage.runCountFailed == '') {
        $localStorage.runCountFailed=0;
    }

    $scope.runCountFailed=$localStorage.runCountFailed;

    if ($localStorage.runTotalYards == null || $localStorage.runTotalYards == '') {
        $localStorage.runTotalYards=0;
    }

    $scope.runTotalYards=$localStorage.runTotalYards;

    if ($localStorage.runAverageYards == null || $localStorage.runAverageYards == '') {
        $localStorage.runAverageYards=0;
    }

    $scope.runAverageYards=$localStorage.runAverageYards;

    if ($localStorage.runTotalPenalty == null || $localStorage.runTotalPenalty == '') {
        $localStorage.runTotalPenalty=0;
    }

    $scope.runTotalPenalty=$localStorage.runTotalPenalty;

    if ($localStorage.passCountSuccess == null || $localStorage.passCountSuccess == '') {
        $localStorage.passCountSuccess=0;
    }

    $scope.passCountSuccess=$localStorage.passCountSuccess;

    if ($localStorage.passCountFailed == null || $localStorage.passCountFailed == '') {
        $localStorage.passCountFailed=0;
    }

    $scope.passCountFailed=$localStorage.passCountFailed;

    if ($localStorage.passTotalYards == null || $localStorage.passTotalYards == '') {
        $localStorage.passTotalYards=0;
    }

    $scope.passTotalYards=$localStorage.passTotalYards;

    if ($localStorage.passAverageYards == null || $localStorage.passAverageYards == '') {
        $localStorage.passAverageYards=0;
    }

    $scope.passAverageYards=$localStorage.passAverageYards;

    if ($localStorage.passTotalPenalty == null || $localStorage.passTotalPenalty == '') {
        $localStorage.passTotalPenalty=0;
    }

    $scope.passTotalPenalty=$localStorage.passTotalPenalty;

    $scope.searchCriteria="";

    $scope.percentRun = (($scope.runCountSuccess+$scope.runCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
    $scope.percentRun = Math.round($scope.percentRun*100);

    if ($scope.percentRun == null || $scope.percentRun == '' || isNaN($scope.percentRun)) {
        $scope.percentRun=0;
    }

    $scope.percentPass = (($scope.passCountSuccess+$scope.passCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
    $scope.percentPass = Math.round($scope.percentPass*100);

    if ($scope.percentPass == null || $scope.percentPass == '' || isNaN($scope.percentPass)) {
        $scope.percentPass=0;
    }

    $scope.percentSuccess = (($scope.passCountSuccess+$scope.runCountSuccess) / ($scope.successfulPlays+$scope.failedPlays));
    $scope.percentSuccess = Math.round($scope.percentSuccess*100);

    if ($scope.percentSuccess == null || $scope.percentSuccess == '' || isNaN($scope.percentSuccess)) {
        $scope.percentSuccess=0;
    }

    $scope.percentFailed = (($scope.passCountFailed+$scope.runCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
    $scope.percentFailed = Math.round($scope.percentFailed*100);

    console.log("percentFailed: " + $scope.percentFailed);

    if ($scope.percentFailed == null || $scope.percentFailed == '' || isNaN($scope.percentFailed)) {
        $scope.percentFailed=0;
    }

    $scope.totalRun = $scope.runCountSuccess + $scope.runCountFailed;
    $scope.totalPass = $scope.passCountSuccess + $scope.passCountFailed;
    $scope.totalPlays = $scope.successfulPlays + $scope.failedPlays;

    //Get the list of plays from the playbook

    PlayData.success(function(data) {
        $scope.tasks = data
    });

    PlayDataFlat.success(function(data) {
        $scope.tasksFlat = data
    });

    console.log($scope.tasksFlat);


    //Set the list of results from a play that need to be tracked

    $scope.results = ["Success","Failed - OL","Failed - QB","Failed - RB","Failed - WR","Failed - Penalty"];
    $scope.formations = ["Red", "Blue motion Red", "Blue", "Red motion Blue", "Green", "Orange motion Green", "Yellow motion Green", "Green motion", "Orange", "Green motion Orange", "Orange motion", "Yellow", "Green motion Yellow", "Yellow motion"];

    //Provides the list of reporting filters for the reports page drop down list
    $scope.filters = ["","Success","Failed"];
    this.searchCriteria=[0];

    //Set the variable that is shown on the play result screen to be a null value
    $scope.playYards = {value: ''};

    //Set the variable that is shown on the play result screen to be a null value
    $scope.playNotes = {text: ''};

    //twitter code starts - this is to make a secure connection to a Twitter app on teh Bobcats account

    var twitterKey = 'STORAGE.TWITTER.KEY';
    var clientId = 'pERVeEa1V755izcimfN6L2N4r';
    var clientSecret = 'YCUi4mbk7iXNIN5hUSOoLzv1K10GOfP7Bn1StEA4o3brNSJSTx';
    var myToken = '';

    $scope.tweet = {};

    $ionicPlatform.ready(function() {
        myToken = JSON.parse(window.localStorage.getItem(twitterKey));
        if (myToken === '' || myToken === null) {
            $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
                myToken = succ;
                window.localStorage.setItem(twitterKey, JSON.stringify(succ));
                $twitterApi.configure(clientId, clientSecret, succ);
                $scope.showHomeTimeline();
            }, function(error) {
                console.log(error);
            });
        } else {
            $twitterApi.configure(clientId, clientSecret, myToken);
            $scope.showHomeTimeline();
        }
    });

    $scope.showHomeTimeline = function() {
        $twitterApi.getHomeTimeline().then(function(data) {
            $scope.home_timeline = data;
        });
    };

    $scope.submitTweet = function(messageToTweet) {

        var myPopup = $ionicPopup.show({
        template: '<ng-model="confirmdtwitterpost">',
        title: 'Post to Twitter ?',
        scope: $scope,
        buttons: [
            { text: 'Cancel' },
                {
                    text: '<b>Post</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $twitterApi.postStatusUpdate(messageToTweet).then(function(result) {
                            $scope.showHomeTimeline();
                        });
                    }
                }
            ]
        });
    }

//twitter code end

    //From the select a play screen this records the play information in temporary variables to use later on the results screen

    $scope.setPlay = function(playSelected, itemSelected) {
        console.log(playSelected);

        if (itemSelected != "no") {
          $scope.toggleGroup(itemSelected);

        }

        console.log("play is " + playSelected.title);
        console.log(playSelected);
        $scope.selectedPlay = playSelected.title;
        $scope.selectedPublicPlay = playSelected.public;
        $scope.playtype = playSelected.playtype;
        $scope.formations = playSelected.formations;

    };

    //From the first play screed, the formation information is stored in a temporary variable for use later

    $scope.setFormation = function(formation) {
        $scope.selectedFormation = formation;
        console.log(formation);
    };

    //This is called when a play is completed with result information and the button pressed with Tweet or without

    $scope.addPlay = function(aboutPlay, tweet) {

        //set the object properties from the previous screens
        //this could be more efficiently done by pulling the model into the functions for each page
        //for now the data elements on the page are pulled into the 'aboutPlay' object that will be pushed onto the playsMade array
        //counters are updated at the same time the object is built depending on the result of the specific play

        aboutPlay.play=$scope.selectedPlay;
        aboutPlay.formation=$scope.selectedFormation;
        aboutPlay.playtype=$scope.playtype;

        //if a successful play

        if (aboutPlay.result == "Success"){

            $scope.successfulPlays++; //count the scuccessful plays

            if (aboutPlay.value == null || aboutPlay.value == '') {

                aboutPlay.value=0; //if no yards set to 0 to support average calculations (or errors on null)

            }

            if (aboutPlay.text == null || aboutPlay.text == '') {

                aboutPlay.text='';

            }

            total = total + aboutPlay.value; //add yards to the running total

            if ($scope.playtype == "run"){ //if a run play

                console.log("run play");
                $scope.runTotalYards = $scope.runTotalYards + aboutPlay.value;
                $scope.runCountSuccess ++;
                console.log($scope.runCountSuccess);

            } else //if a pass play
            {
                $scope.passTotalYards = $scope.passTotalYards + aboutPlay.value;
                $scope.passCountSuccess ++;

            }

        } else //if a failed play
        {
            aboutPlay.value=0; //set yards to 0 to support average calculations (or errors on null)
            $scope.failedPlays++; //count the failed plays

            if ($scope.playtype == "run"){ //if a run play

                $scope.runCountFailed ++;

            } else //if a pass play
            {
                $scope.passCountFailed ++;

            }
        }

        if (aboutPlay.result == "Failed - Penalty"){

            $scope.penaltyCount++; //count the penalties

            if ($scope.playtype == "run"){ //if a run play

                $scope.runTotalPenalty ++;

            } else //if a pass play
            {
                $scope.passTotalPenalty ++;

            }
        }

        //put the cleaned up play data into the array of plays

        $scope.playsMade.push(angular.copy(aboutPlay));

        //calculate the average yards

        if (total==0){

            $scope.averageYards=0;

            if ($scope.playtype == "run"){ //if a run play

                $scope.runAverageYards=0;

            } else //if a pass play
            {
                $scope.passAverageYards=0;

            }

        } else {

            $scope.averageYards=Math.round(total/$scope.successfulPlays);

            if ($scope.playtype == "run"){ //if a run play

                $scope.runAverageYards=Math.round($scope.runTotalYards/$scope.runCountSuccess);

            } else //if a pass play
            {
                $scope.passAverageYards=Math.round($scope.passTotalYards/$scope.passCountSuccess);

            }

        }

        $scope.percentRun = (($scope.runCountSuccess+$scope.runCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
        $scope.percentRun = Math.round($scope.percentRun*100);

        $scope.percentPass = (($scope.passCountSuccess+$scope.passCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
        $scope.percentPass = Math.round($scope.percentPass*100);

        $scope.percentSuccess = (($scope.passCountSuccess+$scope.runCountSuccess) / ($scope.successfulPlays+$scope.failedPlays));
        $scope.percentSuccess = Math.round($scope.percentSuccess*100);

        $scope.percentFailed = (($scope.passCountFailed+$scope.runCountFailed) / ($scope.successfulPlays+$scope.failedPlays));
        $scope.percentFailed = Math.round($scope.percentFailed*100);

        $scope.totalRun = $scope.runCountSuccess + $scope.runCountFailed;
        $scope.totalPass = $scope.passCountSuccess + $scope.passCountFailed;
        $scope.totalPlays = $scope.successfulPlays + $scope.failedPlays;

        //push the data into the array

        $scope.yardsTotal = total; //set the scope variable for the total yards to display later

        //push the data into local storage

        $localStorage.playsMadeLocal=$scope.playsMade;
        $localStorage.yards=$scope.yardsTotal;
        $localStorage.success=$scope.successfulPlays;
        $localStorage.failed=$scope.failedPlays;
        $localStorage.penalties=$scope.penaltyCount;
        $localStorage.averageYards=$scope.averageYards;
        $localStorage.runTotalYards=$scope.runTotalYards;
        $localStorage.runCountSuccess=$scope.runCountSuccess;
        $localStorage.runCountFailed=$scope.runCountFailed;
        $localStorage.runTotalPenalty=$scope.runTotalPenalty;
        $localStorage.runAverageYards=$scope.runAverageYards;
        $localStorage.passTotalYards=$scope.passTotalYards;
        $localStorage.passCountSuccess=$scope.passCountSuccess;
        $localStorage.passCountFailed=$scope.passCountFailed;
        $localStorage.passTotalPenalty=$scope.passTotalPenalty;
        $localStorage.passAverageYards=$scope.passAverageYards;

        //action if the tweet button is pressed

        if (tweet) {

            tweetText=$scope.selectedPublicPlay + ' for ' +
                this.aboutPlay.value + ' yards. ' +
                this.aboutPlay.text;
            $scope.submitTweet(tweetText);
        }

        //reset the values of the result page for next time

        this.aboutPlay.value='';
        this.aboutPlay.result=0;
        this.aboutPlay.text='';

        console.log($scope.playsMade);
        console.log($localStorage.playsMadeLocal);

    };

    //Clear the data

    $scope.deleteData = function() {

        var myPopup = $ionicPopup.show({
        template: '<ng-model="confirmdeleteplays">',
        title: 'Are you sure you want to delete all play data ?',
        scope: $scope,
        buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Delete Plays</b>',
                type: 'button-positive',
                onTap: function(e) {

                    //clear local variables

                    $scope.playsMade = [];
                    $scope.yardsTotal=0;
                    $scope.successfulPlays=0;
                    $scope.failedPlays=0;
                    $scope.averageYards=0;
                    $scope.penaltyCount=0;
                    total=0;
                    $scope.runTotalYards=0;
                    $scope.runCountSuccess=0;
                    $scope.runCountFailed=0;
                    $scope.runTotalPenalty=0;
                    $scope.runAverageYards=0;
                    $scope.passTotalYards=0;
                    $scope.passCountSuccess=0;
                    $scope.passCountFailed=0;
                    $scope.passTotalPenalty=0;
                    $scope.passAverageYards=0;
                    $scope.totalPlays=0;
                    $scope.totalRun=0;
                    $scope.totalPass=0;
                    $scope.percentFailed=0;
                    $scope.percentSuccess=0;
                    $scope.percentPass=0;
                    $scope.percentRun=0;
                    //clear local storage variables

                    $localStorage.playsMadeLocal=[];
                    $localStorage.yards=0;
                    $localStorage.success=0;
                    $localStorage.failed=0;
                    $localStorage.penalties=0;
                    $localStorage.averageYards=0;
                    $localStorage.runTotalYards=0;
                    $localStorage.runCountSuccess=0;
                    $localStorage.runCountFailed=0;
                    $localStorage.runTotalPenalty=0;
                    $localStorage.runAverageYards=0;
                    $localStorage.passTotalYards=0;
                    $localStorage.passCountSuccess=0;
                    $localStorage.passCountFailed=0;
                    $localStorage.passTotalPenalty=0;
                    $localStorage.passAverageYards=0;

                }
            }
        ]
        });
    };

    //Email the data for sharing

    $scope.shareData = function () {

        if(window.plugins && window.plugins.emailComposer) {

            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {

                console.log("Email Success");

            },
            "Sybject Here",
            $scope.playsMade,
            ["richard.ackroyd@live.co.uk"],
            null,
            null,
            false,
            null,
            null
            )

        }


    };

$scope.toggleGroup = function(group) {
  console.log(group);
  group.show = !group.show;
  console.log("first press " + group.show);
};


$scope.isGroupShown = function(group) {

  return group.show;
};

$scope.setCategoryList = function () {

console.log("changed");

  if ($scope.playListChoice == 0){
    $scope.playListChoice=1;
  } else {
    $scope.playListChoice=0;
  }

console.log("changed");

};

$scope.isCategoryList = function () {
//return 0;

  return $scope.playListChoice;

};

});
