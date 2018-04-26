'use strict';
/*global appUrl, ajax, $*/

(function () {
   
   var search = document.getElementById('search');
   var message = document.querySelector('#data');
   
   search.addEventListener("click", function(event) {
      var location = document.getElementById("location").elements[0].value;

      //var url = 'https://api.yelp.com/v3/businesses/search?term=bars&location=' + location;// + process.env.API_KEY;

      var url = '/client';
      ajax.Ready(ajax.Request('POST', url, function (data) {
         var userObject = JSON.parse(data);
         alert(data)
         $("#data").append(userObject)
      }));
      
      /*
      $.ajax({ url: url,
               headers: {'Authorization': 'Bearer ' + process.env.API_KEY,
                         'Cache-Control' : 'no-cache',
                         'Content-Type': 'application/json'
                        },
               method: 'GET',
               dataType: 'json',
               data: null,
               success: function(data) {
                  $("#data").html(data);
               }*/
   },{"passive": true});

})();




/*
   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);

      if (userObject.displayName !== null) {
         updateHtmlElement(userObject, displayName, 'displayName');
      } else {
         updateHtmlElement(userObject, displayName, 'username');
      }

      if (profileId !== null) {
         updateHtmlElement(userObject, profileId, 'id');   
      }

      if (profileUsername !== null) {
         updateHtmlElement(userObject, profileUsername, 'username');   
      }

      if (profileRepos !== null) {
         updateHtmlElement(userObject, profileRepos, 'publicRepos');   
      }

   }));
   */