// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])

.run(function($ionicPlatform, $rootScope, $http, $ionicPopup, $state) {
  $ionicPlatform.ready(function() {

    $rootScope.baseUrl = 'http://sa-book.com/admin/public/';

    $rootScope.checkAuth = function (cred, isString) {
      if(cred && isString) {
        cred = JSON.parse(cred);
      }
      if(!cred) {
        cred = {};
      }
      console.log(cred);
      $http.post($rootScope.baseUrl + 'check_cred', {
        email: cred.email,
        password: cred.password
      }).then(function (res) {
        if(res.data == 'true') {
          localStorage['ibook_user'] = JSON.stringify(cred);
          $rootScope.loggedIn = true;
        }else{
          localStorage.removeItem('ibook_user');
          $rootScope.loggedIn = false;
        }
      })
    }

    if(localStorage['ibook_user']) {
      $rootScope.loggedIn = true;
    }

  if($rootScope.loggedIn) {
    $state.go('tab.dash');
  }else{
   if($state.current.name != 'login') {
    $state.go('login');
   }
    $state.go('login');
  }

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

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('viewer', {
    url: '/viewer',
    templateUrl: 'templates/viewer.html',
    controller: 'viewerCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
