//This File will hold a factory that Will handle all of our
var app = angular.module('catthings_app');

//This Factory will act as a global doorway to the THIGNS API, all controllers
//will have access to this service.
app.factory('thingsAPI', ['$http', '$q', function($http, $q){
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
  obj.getUserName = ()=>{return _user;}
  obj.getBaseURL = () =>{return _urlBase;}
  obj.getAdmin = ()=>{return _admin;}

  //Setters
  obj.setToken = (token)=>{_token=token};
  obj.setUserName = (user)=>{_user=user};
  obj.setAdmin = (admin)=>{_admin=admin};

  //route calls
  obj.authenticate=(loginData)=>{
    return $http.post(_urlBase+'authenticate', loginData);
  }

  //get view
  obj.getView = ()=>{
    return $http.get(_urlBase+'view');
  }

  //Add new item
  obj.add = (name, desc, price, thresh)=>{
    var req = {
      method : 'POST',
      url: `${_urlBase}a/admin/add/${name}/${desc}/${price}/${thresh}`,
      headers: {
        'x-access-token': _token
      }
    }
    return $http(req);
  }

  //Get recent transaction based on input number
  obj.getRecent = (num) =>{
    if(num >= 1)
    {
      var req = {
        method : 'GET',
        url: `${_urlBase}a/admin/history/recent/${num}`,
        headers: {
          'x-access-token': _token
        },
      }
      return $http(req);
    }
    else
    {
      num = 0;
      var req = {
        method : 'GET',
        url: `${_urlBase}a/admin/history/recent/${num}`,
        headers: {
          'x-access-token': _token
        },
      }
      return $http(req);
    }
  }

  //checkout
  obj.checkout = (id, person, qty)=>{
    var req = {
      method: 'POST',
      url: `${_urlBase}a/checkout/${id}/${person}/${qty}`,
      headers: {
        'x-access-token': _token
      },
    }

    var deferred = $q.defer();
    var promise = $http(req);
    promise.success(function(){
      deferred.resolve({
        success: true,
        item_id: id,
        name: person,
        quantity: qty
      });
    });
    promise.error(function(err, stat){
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

    //checkin
    obj.checkin = (id, person, qty)=>{
      var req = {
        method: 'POST',
        url: `${_urlBase}a/admin/checkin/${id}/${person}/${qty}`,
        headers: {
          'x-access-token': _token
        }
      }

      var deferred = $q.defer();
      var promise = $http(req);
      promise.success(function(){
        deferred.resolve({
          success: true,
          item_id: id,
          name: person,
          quantity: qty
        });
      });
      promise.error(function(err, stat){
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
    }

    //log out
    obj.logOut = ()=>{
      _name = 'Guest';
      _admin = false;
      _token = null;
    };

  return obj;//return the object
}]);
