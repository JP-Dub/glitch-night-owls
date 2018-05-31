'use strict';
/*global appUrl, ajax, $, navigator*/

(function () {

   var search = document.getElementById('search');
   var main = document.getElementById('main');
   var message = document.querySelector('#data');
   var alias, latitude, longitude;
   var bars = [];
   
   // pressing the "going" button returns name of bar and yelp ID and should log to db 
   function loadBtnEvents() { 
      var twitterBtn = document.getElementsByClassName('twitter-btn'),
          btnLength = twitterBtn.length;
      
      $('.twitter-btn').click(function(){
         window.location.href = '/auth/twitter';
      })
        
      for(var i = 0; i < btnLength; i++) {
      
         twitterBtn[i].addEventListener('click', function(event) {
            //event.preventDefault();
            
            var name = (this.parentNode.parentNode.id).slice(13);
            console.log(this.parentNode.parentNode.parentNode)
            var logBars = {
               "id" : bars[name].name,
               "name" : bars[name].id
            };
            /*
            console.log(bars[name].name, bars[name].id)
            $.get('/api/:id/clicks', logBars, function(data) {
               
            })*/
            
         }); 
      } // for(loop) 
   } // loadBtnEvents()   

   function postResults(locale, userData) { 
      
      var printScreen = function(obj) {   
         var length = obj.length,
             i = 0;
        
         for(i; i < length; i++) {
            var div = document.createElement("DIV");
            main.appendChild(div);
            div.id = "businesscard_" + i;
            div.className = "container"; 
            var identity = {
               "id" : obj[i].id,
               "name": obj[i].name
            };
            
            bars.push(identity);
            
            // if statement used when getLocation() is called prior to loading the screen
            if(typeof locale === "object" && locale != null) {
               obj[i].alias = obj[i].alias + '?start=' + locale.latitude + '%20' + locale.longitude;
            }
           
            // no image will revert to 'no image available' icon
            if(!obj[i].image_url) {
               obj[i].image_url = '../public/img/NoProductImage_300.jpg';
            }
           
            var costDescription;
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
           
            $("#businesscard_" + i).html("<div class='img-holder'><img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url' height='150' width='150'><br><button class='twitter-btn' title='Let people know that you are going by pushing the button' type='submit' value='submit'>Going <span id='going' class='badge'>0</span</button></div><div class='business'><h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel='" + obj[i].alias + "'>" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p></div>");    
            //$(".img-holder").html("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url' height='150' width='150'><br><a href='/auth/twitter'><button class='twitter-btn' title='Let people know that you are going by pushing the button'>Going <span class='badge'>0</span</button></a>");
            //$(".business").html("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/'" + obj[i].alias + "' target='_blank' title='Get Directions' rel='" + obj[i].alias + "'>" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p>")
            $("#businesscard_" + i).css({
               marginTop : ".625em",
               border : "1px solid grey",
               borderRadius : ".3em",
               backgroundColor : "#daf1e0"
            });
            
         } // for(loop)
         
         loadBtnEvents();
      }   

      if(userData) {
         printScreen(userData);
         
      } else {
      
         if(typeof locale === "object") {
            var path = '/businesses/search?term=bars&location=' + locale.latitude + '%20' + locale.longitude; 
         } else {
            path = '/businesses/search?term=bars&location=' + locale;
         }      
      
         $.post(path, function(data) {
            var obj = JSON.parse(data);
            
            printScreen(obj)
         });
      }
   } // postResults(); 

   function getLocation(done) {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
            var obj = {};
            obj.latitude = position.coords.latitude;
            obj.longitude = position.coords.longitude;
            done(obj);
         }, showError);
      } else {
         console.log("Geolocation is not supported by this browser.");
      }
   }
  
   function showError(error) {
      switch(error.code) {
         case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
         case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
         case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
         case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
      }
   }
  
   search.addEventListener("click", function(event) {
      event.preventDefault();
      var location = document.getElementById("location").elements[0].value;
      bars = bars.slice(bars.length);//removes key/properties
      postResults(location);
   }); // search.EventListener()  
   
   if(window.location.pathname === '/loggedIn') {
      $.get('/user/:location', function(data) {
         $('#plapal').attr('placeholder', data[1].twitter.location)
         postResults(null, data[0].nightlife.cache);
      });
   }   
   
})();


//<button class='twitter-btn' title='Let people know that you are going by pushing the button' value='submit'>Going <span id='going' class='badge'>0</span</button>
   
   /*
   function showPosition(position) {
      var local = {};
      local.latitude = position.coords.latitude;
      local.longitude = position.coords.longitude;
     
      var posi = "Latitude: " + latitude + "<br>Longitude: " + longitude; 
      console.log(location);
   }
   */

            //var num = alias.split("").pop();
            //var address = 'https://www.yelp.com/map/' + alias + '?start='+ local.latitude + '%20' + local.longitude;
            //window.open(address, '_blank');

//var lat = 26.579147499999998;
//var long = -80.1595932;
//var address = 'https://www.yelp.com/map/' + obj[i].alias + '?start='+ latitude + '%20' + longitude;
/*
<div class='img-holder'>
   <img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url' height='150' width='150'><br>
   <a href='/auth/twitter'><button class='twitter-btn' title='Let people know that you are going by pushing the button'>Going <span class='badge'>0</span</button></a>
</div>   
<div class='business'>
   <h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br>
   
   <p class='address'><a id='directions' href='https://www.yelp.com/map/" + obj[i].alias + "' title='Get Directions' target='_blank' rel='" + obj[i].alias + "'>" + obj[i].location.address1 + "<br>
   
   " + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br>
   
   <span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br>
   
   <span class='price'>Price: " + obj[i].price + " " + costDescription + "</span><br>
   
   <span class='rate'>Rating: " + obj[i].rating + "</span></p>
</div>*/

//"<div class='img-holder'><img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url' height='150' width='150'><br><a href='/auth/twitter'><button class='twitter-btn' title='Let people know that you are going by pushing the button'>Going <span class='badge'>0</span</button></a></div><div class='business'><h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel='" + obj[i].alias + "'>" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p></div>");