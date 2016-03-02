// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var junosApp = angular.module('starter', ['ionic', 'starter.controllers']);

var settingsApp = junosApp.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
   
      showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Log Out',
       template: 'Are you sure you want to Log Out?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         alert("yes");
       } else {
         alert("no");
       }
     });
   };
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

var configApp = settingsApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
   
  .state('app.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        templateUrl: 'templates/logout.html'
      }
    }
  })
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
           controller: 'homeCtrl'
        }
     }
    })
  .state('app.achievements', {
      url: '/achievements',
      views: {
        'menuContent': {
          templateUrl: 'templates/achievements.html'
        }
      }
    })
  .state('app.refreshAll', {
      url: '/refreshAll',
      views: {
        'menuContent': {
          templateUrl: 'templates/refreshAll.html'
        }
      }
    })
  .state('app.syncOfflineData', {
      url: '/syncOfflineData',
      views: {
        'menuContent': {
          templateUrl: 'templates/syncOfflineData.html'
        }
      }
    })
  .state('app.purgeData', {
      url: '/purgeData',
      views: {
        'menuContent': {
          templateUrl: 'templates/purgeData.html'
        }
      }
    })
  .state('app.scheduleExam', {
      url: '/scheduleExam',
      views: {
        'menuContent': {
          templateUrl: 'templates/scheduleExam.html'
        }
      }
    })
  .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/help.html'
        }
      }
    })
  .state('app.feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/feedback.html'
        }
      }
    })
  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
}).config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);


//ionic serve