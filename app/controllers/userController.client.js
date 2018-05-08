'use strict';
/*global appUrl, ajax, $*/

(function () {
   
   var search = document.getElementById('search');
   var message = document.querySelector('#data');

   search.addEventListener("click", function(event) {
      event.preventDefault();
      var location = document.getElementById("location").elements[0].value,
          path = '/businesses/search?term=bars&location=' + location;
         
         $.post(path, function(data) {
            var obj = JSON.parse(data),
                costDescription,
                len = data.length,
                i = 0;
            
            for(i; i < len; i++) {
               var div = document.createElement("DIV");
               document.body.appendChild(div);
               div.id = "businesscard_" + i;
               div.className = "container";       
               
               if(!obj[i].image_url) {
                  obj[i].image_url = '../public/img/NoProductImage_300.jpg';
               }
               
               switch(obj[i].price) {
                  case "$":
                     costDescription = "Inexpensive";
                     break;
                  case "$$":
                     costDescription = "Moderate";
                     break;
                  case "$$$":
                     costDescription = "Pricey";
                     break;
                  case "$$$$":
                     costDescription = "Ultra High End";
                     break;
               }
               
               $("#businesscard_" + i).html("<div class='img-holder'><img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url' height='150' width='150'><br><a href='#'><button class='twitter-btn' title='Let people know that you are going by pushing the button'>Going <span class='badge'>0</span</button></a></div><div class='business'><h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' title='Get Directions' target='_blank'>" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p></div>");    
               
               $("#businesscard_" + i).css({
                  marginTop : ".625em",
                  border : "1px solid grey",
                  borderRadius : ".3em",
                  backgroundColor : "lightgrey"
               });
            }
         });  
   });
   
})();