'use strict';
/* global ajax */
(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ajax.Ready(ajax.Request('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function () {

      ajax.Request('POST', apiUrl, function () {
         ajax.Request('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {

      ajax.Request('DELETE', apiUrl, function () {
         ajax.Request('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
