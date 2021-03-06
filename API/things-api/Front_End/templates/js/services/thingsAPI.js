/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

/*
This file contains the AngularJS code maintaining the thingsAPI factory.
The thingsAPI allows the frontend to make API calls in an easy to understand
way.
*/

//This File will hold a factory that Will handle all of our
var app = angular.module('catthings_app');

//This Factory will act as a global doorway to the THIGNS API, all controllers
//will have access to this service.
app.factory('thingsAPI', ['$http', '$q', function ($http, $q) {
    //private Variables
    var _admin = false;
    var _token = null;
    var _user = 'Guest';

    //For local dev mode comment out the first line and uncomment the second...
    var _urlBase = 'https://things.cs.pdx.edu:3000/api/';
    //var _urlBase = 'https://localhost:3000/api/';

    var obj = {}; //this is the object that will be handed to our controller.
    //Methods

    //Getters
    obj.getUserName = () => { return _user; }
    obj.getBaseURL = () => { return _urlBase; }
    obj.getAdmin = () => { return _admin; }

    //Setters
    obj.setToken = (token) => { _token = token };
    obj.setUserName = (user) => { _user = user };
    obj.setAdmin = (admin) => { _admin = admin };

    //Route calls
    obj.authenticate = (loginData) => {
        return $http.post(_urlBase + 'authenticate', loginData);
    }

    //Get view
    obj.getView = () => {
        return $http.get(_urlBase + 'view');
    }

    //get ShoppingList
    obj.getShoppingList = () => {
        var req = {
            method: 'GET',
            url: `${_urlBase}a/admin/shopping_list`,
            headers: {
                'x-access-token': _token
            }
        }
        return $http(req);
    }

    //get Statistic
    obj.getStatistic = (name) => {
        var req = {
            method: 'GET',
            url: `${_urlBase}a/admin/stats/avgperday/${name}`,
            headers: {
                'x-access-token': _token
            }
        }
        return $http(req);
    }

    //Get Average Checkout per Day
    obj.getAverage = () => {
      var req = {
        method: 'GET',
        url: `${_urlBase}a/admin/stats/allavgperday`,
        headers:{
          'x-access-token': _token
        }
      }
      return $http(req);
    }

    //Get Average amoutn consumed by week
    //Get Average Checkout per Day
    obj.getAverageWeekly = () => {
      var req = {
        method: 'GET',
        url: `${_urlBase}a/admin/stats/allweeklyavg`,
        headers:{
          'x-access-token': _token
        }
      }
      return $http(req);
    }

    //Add new item
    obj.add = (name, qty, desc, price, thresh, tags)=>{
          var req = {
              method: 'POST',
        url: `${_urlBase}a/admin/add/${name}/${qty}/${desc}/${price}/${thresh}/${_user}/${tags}`,
              headers: {
                  'x-access-token': _token
              }
          }
          return $http(req);
      }

    //Get recent transaction based on input number
    obj.getItemHistory = (num, item) => {
        if (num >= 1) {
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/by_item/${item}/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
        else {
            num = 0;
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/by_item/${item}/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
    }

    //Get recent transaction based on tag and input number
    obj.getTagHistory = (num, tag) => {
        if (num >= 1) {
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/by_tag/${tag}/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
        else {
            num = 0;
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/by_tag/${tag}/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
    }

    //Get recent transaction based on input number
    obj.getRecent = (num) => {
        if (num >= 1) {
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/recent/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
        else {
            num = 0;
            var req = {
                method: 'GET',
                url: `${_urlBase}a/admin/history/recent/${num}`,
                headers: {
                    'x-access-token': _token
                },
            }
            return $http(req);
        }
    }

    //Get range of transactions based on start and end date
    obj.getDateHistory = (start, end) => {
        var req = {
            method: 'GET',
            url: `${_urlBase}a/admin/history/by_range/${start}/${end}`,
            headers: {
                'x-access-token': _token
            },
        }
        return $http(req);
    }

    //Checkout
    obj.checkout = (id, person, qty) => {
        var req = {
            method: 'POST',
            url: `${_urlBase}a/checkout/${id}/${person}/${qty}`,
            headers: {
                'x-access-token': _token
            },
        }

        var deferred = $q.defer();
        var promise = $http(req);
        promise.success(function () {
            deferred.resolve({
                success: true,
                item_id: id,
                name: person,
                quantity: qty
            });
        });
        promise.error(function (err, stat) {
            deferred.resolve({
                success: false,
                item_id: id,
                name: person,
                quantity: qty,
                error: err,
                status: stat
            });
        });
        return deferred.promise;
    }//end checkout

    //Checkin
    obj.checkin = (id, person, qty) => {
        var req = {
            method: 'POST',
            url: `${_urlBase}a/admin/checkin/${id}/${person}/${qty}`,
            headers: {
                'x-access-token': _token
            }
        }

        var deferred = $q.defer();
        var promise = $http(req);
        promise.success(function () {
            deferred.resolve({
                success: true,
                item_id: id,
                name: person,
                quantity: qty
            });
        });
        promise.error(function (err, stat) {
            deferred.resolve({
                success: false,
                item_id: id,
                name: person,
                quantity: qty,
                error: err,
                status: stat
            });
        });
        return deferred.promise;
    };

    //Method to get the shopping list from the API
    obj.shoppingList = () => {
      var req = {
        method: 'GET',
        url: `${_urlBase}a/admin/shopping_list`,
        headers: {
          'x-access-token': _token
        }
      }
      return $http(req);
    }

    //Request new item
    obj.request = (qData) => {
      var req = {
        method: 'POST',
        url: `${_urlBase}a/request`,
        headers: {
          'x-access-token': _token,
        },
        data: qData
      }
        return $http(req);
    }

    //Log out
    obj.logOut = () => {
        _name = 'Guest';
        _admin = false;
        _token = null;
    };

    return obj; //Return the object
}]);
