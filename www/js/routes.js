angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.formation', {
    url: '/formation',
    views: {
      'tab1': {
        templateUrl: 'templates/formation.html',
        controller: 'formationCtrl'
      }
    }
  })

    .state('tabsController.allplays', {
    url: '/allplays',
    views: {
      'tab1': {
        templateUrl: 'templates/allplays.html',
        controller: 'allplaysCtrl'
      }
    }
  })
  
  .state('tabsController.reports', {
    url: '/reports',
    views: {
      'tab2': {
        templateUrl: 'templates/reports.html',
        controller: 'reportsCtrl'
      }
    }
  })

  .state('tabsController.datamanagement', {
    url: '/datamanagement',
    views: {
      'tab3': {
        templateUrl: 'templates/datamanagement.html',
        controller: 'datamanagementCtrl'
      }
    }
  })
  
  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.play', {
    url: '/play',
    views: {
      'tab1': {
        templateUrl: 'templates/play.html',
        controller: 'playCtrl'
      }
    }
  })

  .state('tabsController.result', {
    url: '/result',
    views: {
      'tab1': {
        templateUrl: 'templates/result.html',
        controller: 'resultCtrl'
      }
    }
  })

  .state('tabsController.playbook', {
    url: '/playbook',
    views: {
      'tab4': {
        templateUrl: 'templates/playbook.html',
        controller: 'playbookCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/formation')

  

});