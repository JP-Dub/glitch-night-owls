'use strict';

var appUrl = window.location.origin;

var ajax = {
   Ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   Request: function ajaxRequest (method, url, client, callback) {
      var xmlhttp = new XMLHttpRequest();
      var options = {
         'Access-Control-Request-Headers' : ['X-Custom-Header, Authorization', 'Origin', 'CORS'],        
         'Origin': 'https://night-owls-jpiazza.c9users.io',
         'Access-Control-Request-Method': ['GET', 'OPTIONS'],
         'Access-Control-Allow-Origin': '*'
        
      }
      xmlhttp.onreadystatechange = function () {
         
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
      xmlhttp.setRequestHeader('Access-Control-Allow-Origin', 'https://night-owls-jpiazza.c9users.io');
      xmlhttp.setRequestHeader('Authorization', 'Bearern' + options.key);
      xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
 

      xmlhttp.send();
   }
};
   /*
      xmlhttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
      xmlhttp.setRequestHeader('Access-Control-Allow-Origin', 'https://night-owls-jpiazza.c9users.io');
      xmlhttp.setRequestHeader('Authorization', 'Bearern' + options.key);
      xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
   */
      
      //xmlhttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
      //xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
      //xmlhttp.setRequestHeader('Authorization', 'Bearer ' + apiKey);
//Authorization: Bearer API_KEY
//Cache-Control: private
//xmlhttp.withCredentials = true;
/*
      // progress on transfers from the server to the client (downloads)
      function updateProgress (oEvent) {
         if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total * 100;
            // ...
         } else {
            // Unable to compute progress information since the total size is unknown
         }
      }

      function transferComplete(evt) {
         console.log("The transfer is complete.");
      }

      function transferFailed(evt) {
         console.log("An error occurred while transferring the file.");
      }

      function transferCanceled(evt) {
         console.log("The transfer has been canceled by the user.");
      }
      
      xmlhttp.addEventListener("progress", updateProgress);
      xmlhttp.addEventListener("load", transferComplete);
      xmlhttp.addEventListener("error", transferFailed);
      xmlhttp.addEventListener("abort", transferCanceled);
    
    // ---> Code to be placed above xmlhttp.open() <-- //      
    
      xmlhttp.open(method, url, true);
*/