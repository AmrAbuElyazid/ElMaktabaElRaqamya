angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope, $ionicModal, $state, $ionicPopup) {
document.addEventListener('deviceready', function () {
  // Put code here
  console.log(cordova.file.externalDataDirectory)
  $scope.dataDir = 'viewer/web/viewer.html?file=' + cordova.file.dataDirectory + '1.pdf';
});

// $scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/pdfbooksproject/8CuXXBikgQXYhy9PMpNcmdnW1qMVvSNvelIzjpd0FUrTywD9mQ9YxtL5lR7cCmFtNf3vcEuKvVcqiwMUs9Fxl9YGOby31y1ybZlq.pdf';
  
  $scope.getCats = function () {
    $http.get($rootScope.baseUrl + 'categories').then(function (res) {
      $scope.categories = res.data;
    }).then(function (res) {
      
    }, function (err) {
      setTimeout(function () {
        $scope.getCats();
      }, 1000)
    })
  }
  $scope.getCats();

  $scope.search = {};
  $scope.books = {};

  $scope.findBooks = function () {
    if ($scope.search.query.length > 2) {
      $http.get($rootScope.baseUrl + 'find_books/' + $scope.search.query).then(function (res) {
        if(!res.data.length) {
          $scope.books = {};
          $scope.notFound = true;
        }else{
          $scope.books = res.data;
          $scope.notFound = false;
        }
      }).then(function (res) {
        
      }, function (err) {
        setTimeout(function () {
          $scope.findBooks();
        }, 1000)
      })
    }
  }

  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $rootScope.openBook = function(book) {
    $scope.book = book;
    $scope.modal.show();
  };
  $scope.openPDF = function(book) {
    // $scope.modal.hide();
    $scope.url = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + book.book_url;
    var ref = window.open($scope.url, '_blank', 'location=no, EnableViewPortScale=yes');
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  }
  $rootScope.cacheFile = function (book) {

    if(localStorage['ibook_favs']) {
      $scope.books = JSON.parse(localStorage['ibook_favs']);
      for (var i = $scope.books.length - 1; i >= 0; i--) {
        if($scope.books[i].id == book.id) {
          alert('تم حفظ الكتاب مسبقاً')
          return;
        }
      }
    }
    $scope.caching = true;
    var progress = document.getElementById('save-progress');
    setInterval(function () {
      if(progress.value != 95) {
        if(progress.value == 20) {
          progress.value = 35;
        }
        if(progress.value == 60) {
          progress.value = 85;
        }
        progress.value += 1;
      }

    }, 3000)
    var assetURL = book.book_url;
    //File name of our important data file we didn't ship with the app
    var fileName = book.id + '.pdf';
    var store = cordova.file.externalDataDirectory;

        var fileTransfer = new FileTransfer();
        console.log("About to start transfer");
        fileTransfer.download(assetURL, store + fileName, 
            function(entry) {
                console.log("Success!");
                book.nativeURL = entry.nativeURL;
                console.log(JSON.stringify(entry))
                cacheToFav();
            }, 
            function(err) {
                console.log("Error");
                console.dir(err);
            });
        function cacheToFav() {
           if(!localStorage['ibook_favs']) {
            localStorage['ibook_favs'] = JSON.stringify([book]);
           }else{
            var favBooks = JSON.parse(localStorage['ibook_favs']);
            favBooks.push(book);
            localStorage['ibook_favs'] = JSON.stringify(favBooks);
           }
           progress.value = 100;
           console.log('succceeesss')
           $scope.caching = false;
        }
  }

  $scope.report = function (book) {
      $scope.data = {}
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" ng-model = "data.model">',
         title: 'ابلاغ عن مشكله',
         subTitle: 'ماهي مشكلتك؟',
         scope: $scope,
      
         buttons: [
            { text: 'إلغاء' }, {
               text: '<b>إرسال</b>',
               type: 'button-positive',
                  onTap: function(e) {
            
                     if (!$scope.data.model) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
                        return $scope.data.model;
                     }
                  }
            }
         ]
      });

      myPopup.then(function(res) {
        $scope.sendReport = function () {
          $http.post($rootScope.baseUrl + '/report', {
            book_id: book.id,
            email: JSON.parse(localStorage['ibook_user']).email,
            body: $scope.data.model
          }).then(function () {
            
          }, function (err) {
            setTimeout(function () {
              $scope.sendReport();
            }, 1000)
          })
        }
      });    
  }

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.searchModal = modal;
  });
  $rootScope.openSearch = function(query) {
    $scope.search = {};
    if(query) {
      $scope.search.query = query;
      $scope.findBooks();
    }else{
      $scope.books = {};
      $scope.notFound = false;
    }
    $scope.searchModal.show();
  };
  $scope.closeSearchModal = function () {
    $scope.searchModal.hide();
  }


  })

.controller('docCtrl', function ($scope) {
    console.log('a')
    $scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/pdfbooksproject/8CuXXBikgQXYhy9PMpNcmdnW1qMVvSNvelIzjpd0FUrTywD9mQ9YxtL5lR7cCmFtNf3vcEuKvVcqiwMUs9Fxl9YGOby31y1ybZlq.pdf';
})

.controller('viewerCtrl', function($scope, $stateParams, $rootScope, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


// $http.get($rootScope.baseUrl + 'getBook/' + $stateParams.book_id).then(function (res) {
//   console.log(res.data)
//   $scope.pdfUrl = res.data;
// })

//   $scope.next = function () {
//     pdfDelegate.$getByHandle('my-pdf-container').next();
//   }

//   $scope.prev = function () {
//     pdfDelegate.$getByHandle('my-pdf-container').prev();
//   }

// $scope.data = null; // this is loaded async

// $http.get("https://s3-us-west-2.amazonaws.com/pdfbooksproject/8CuXXBikgQXYhy9PMpNcmdnW1qMVvSNvelIzjpd0FUrTywD9mQ9YxtL5lR7cCmFtNf3vcEuKvVcqiwMUs9Fxl9YGOby31y1ybZlq.pdf", {
//     responseType: 'arraybuffer'
// }).then(function (response) {
//   console.log(response.data)
//     $scope.data = new Uint8Array(response.data);
// console.log($scope.data)
// });
document.addEventListener('deviceready', function () {
  // Put code here
  console.log(cordova.file.externalDataDirectory)
  $scope.dataDir = 'viewer/web/viewer.html?file=' + ':///storage/sdcard0/Android/data/com.ionicframework.ibook646717/files/' + '1.pdf';
  window.open($scope.dataDir, '_blank', 'location=yes, EnableViewPortScale=yes')
});
})

.controller('ChatsCtrl', function($scope, $stateParams, $rootScope, $ionicModal, $ionicLoading, $http, $rootScope) {
  // $scope.limit = {};
  // $scope.limit.n = 3;
  function render() {
    if(localStorage['ibook_favs']) {
      $scope.books = JSON.parse(localStorage['ibook_favs']);
      console.log(JSON.stringify($scope.books))
    }else{
      $scope.books = {};
    //   for (var i = 400; i >= 0; i--) {
    //     $scope.books[i] = {};
    //     $scope.books[i].book_author = 'amr';      }
    }
  }
  setInterval(render, 10000)
  render();
  $scope.openPDFLocally = function (book) {
    cordova.plugins.fileOpener2.open(
        book.nativeURL, 
        'application/pdf', 
        {
          error : function(e) { 
              console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
          },
          success : function () {
              console.log('file opened successfully');        
          }
        } 
    );
  }

    $scope.show = function() {
      $ionicLoading.show({
        template: 'جاري التحميل'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };
  
  

  $ionicModal.fromTemplateUrl('settingsModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.settingsModal = modal;
  });
  $scope.openSettings = function() {
    $scope.settingsModal.show();
    $scope.logout = function () {
      $scope.show();
      localStorage.removeItem('ibook_user');
      setTimeout(function () {
        console.log('a')
        window.location = '/';
      }, 1000);
    }
    $scope.allBooks = [1, 2];
    $scope.cacheAll = function () {
      $scope.show();
      $http.get($rootScope.baseUrl + 'getAllBooks').then(function (res) {
        console.log(res.data);
        $scope.hide();
        $scope.allBooks = res.data;
        var progress = document.getElementById('cacheAllProgress');
        progress.max = $scope.allBooks.length;
        $scope.max = $scope.allBooks.length;
        progress.value = 0;
        $scope.value = 0;
        for (var i = $scope.allBooks.length - 1; i >= 0; i--) {
          $rootScope.cacheFile($scope.allBooks[i])
          progress.value = progress.value + 1;
          $scope.value = $scope.value + 1;
        }
      }).then(function (res) {
        
      }, function (err) {
        setTimeout(function () {
          $scope.cacheAll();
        }, 1000)
      })
    }
  };


  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.settingsModal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


})

.controller('loginCtrl', function ($scope, $http, $rootScope, $ionicPopup, $state, $ionicLoading) {
  $scope.cred = {};

    $scope.show = function() {
      $ionicLoading.show({
        template: 'جاري التحميل'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };
  
  

  $scope.login = function () {
    $scope.show();
      $http.post($rootScope.baseUrl + 'check_cred', {
        email: $scope.cred.email,
        password: $scope.cred.password
      }).then(function (res) {
        $scope.hide();
        if(res.data == 'true') {
          localStorage['ibook_user'] = JSON.stringify($scope.cred);
          $rootScope.loggedIn = true;
          $state.go('tab.dash');
        }else{
          localStorage.removeItem('ibook_user');
          $rootScope.loggedIn = false;
         var alertPopup = $ionicPopup.alert({
           title: 'خطأ!',
           template: 'بيانات خاطئه'
         });
        }
      }, function (err) {
        setTimeout(function () {
          $scope.login();
        }, 1000)
      })
  }

})