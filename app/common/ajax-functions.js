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
   Request: function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();
      //xmlhttp.withCredentials = true;
      
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };
      
      xmlhttp.open(method, url, true);
      //alert(url)
      //xmlhttp.setRequestHeader('Authorization', 'Bearer ' + process.env.API_KEY);
      //xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
      xmlhttp.send();
   }
};
//Authorization: Bearer API_KEY
//Cache-Control: private