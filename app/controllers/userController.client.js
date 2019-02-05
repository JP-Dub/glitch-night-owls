'use strict';
/*global appUrl, ajax, $, navigator*/

(function () {

   var login   = document.getElementById('login'),
       search  = document.getElementById('search'),
       main    = document.getElementById('main'),
       message = document.querySelector('#data'),
       alias, latitude, longitude, location,
       bars = [];
     
   // pressing the "going" button returns name of bar and yelp ID and should log to db 
   function loadBtnEvents() { 
      var twitterBtn = document.getElementsByClassName('bttn'),
          btnLength = twitterBtn.length;
          
      // $('.bttn').click(function(){
      //    window.location.href = '/auth/twitter';
      // });
        
      for(var i = 0; i < btnLength; i++) {
         twitterBtn[i].addEventListener('click', function(event) {
            //event.preventDefault();
            var name = (this.parentNode.parentNode.id).slice(13);
          
            var logBars = {
              // "id" : bars[name].name,
               "id" : bars[name].id
            };
            
            console.log(bars[name].name, bars[name].id, logBars)
            $.post('api/:id/clicks', logBars, function(data) {
               
            })
         }); 
      }; // for(loop) 
   }; // loadBtnEvents()   

   function postResults(locale, userData) { 
     
     // delete previous bar info
     if(main.childNodes.length > 1) {
       while(main.firstChild) {
         main.removeChild(main.firstChild);
       };
     }
     
      var printScreen = function(obj) {   
         var length = obj.length,
             i      = 0;
         
         for(i; i < length; i++) {
            var div = document.createElement("DIV"),
               imgHolder = document.createElement('DIV'),
               business = document.createElement('DIV');
           
            main.appendChild(div);
            div.id = "businesscard_" + i;
            div.className = "container"; 
            imgHolder.className = 'img-holder';
            business.className = 'business';
            var businesscard = document.getElementById('businesscard_' + i);
            businesscard.appendChild(imgHolder);
            businesscard.appendChild(business);
               
            // nightlife cache
            var identity = {
               "id"  : obj[i].id,
               "name": obj[i].name
               };
            
            bars.push(identity);
            
            // if statement used when getLocation() is called prior to loading the screen
            if(typeof locale === "object" && locale != null) {
               obj[i].alias = obj[i].alias + '?start=' + locale.latitude + '%20' + locale.longitude;
            }
           
            // no image will revert to 'no image available' icon
            if(!obj[i].image_url) obj[i].image_url = '../public/img/NoProductImage_300.jpg';            
            
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
               default:
                  obj[i].price = '';
                  costDescription = "Unavailable";
                  break;
            };
           
            //$("#businesscard_" + i).html("<div class='img-holder'><img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br><button class='twitter-btn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='going' class='badge'>0</span></button></div><div class='business'><h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel=" + obj[i].alias + ">" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p></div>");    
            $("#businesscard_" + i + "> .img-holder").append("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br><button class='bttn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='going' class='badge'>0</span></button>");
            $("#businesscard_" + i + "> .business").append("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel=" + obj[i].alias + ">" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p>");
            // $('.img-holder').html("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br>") 
            // $('.img-holder').append("<button class='twitter-btn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='going' class='badge'>0</span></button>");
            // $('.business').html("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel='" + obj[i].alias + "'>" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p></div>");  
  
         }; // for(loop)
        
         loadBtnEvents();
      };   
      
      // userData comes from screen refresh after twitter log in
      if(userData) {
         printScreen(userData);
      } else {
         let path;
         if(typeof locale === "object") {
            path = '/businesses/search?term=bars&location=' + locale.latitude + '%20' + locale.longitude; 
         } else {
            path = '/businesses/search?term=bars&location=' + locale;
         }      
      
         $.post(path, function(data) {
            var obj = JSON.parse(data);
            printScreen(obj)
         });
      };
   }; // postResults();

   // currently not in use
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
      };
   };
  
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
      };
   };
   
   // listener for Twitter login button
   login.addEventListener("click", (event) => {
     event.preventDefault();
     window.location.href = '/auth/twitter';
   });
  
   // listener for Search button
   search.addEventListener("click", function(event) {
      event.preventDefault();
      location = document.getElementById("location").elements[1].value;
      //bars = bars.slice();//removes key/properties
      bars = [];
      postResults(location);
   }); // search.EventListener()  
   
   // checks if user is logged in
   if(window.location.pathname === '/loggedIn') {
      $.get('/user/:location', function(data) {
        var locale, userData;

        if(data.nightlife.cache.length === 0) {
           locale = data.twitter.location;
           userData = null;
        } else {
          locale = null;
          userData = data.nightlife.cache;
        }
        //plapal
        $('#searchBar').attr('placeholder', data.twitter.location)
        postResults(locale, userData);
      });
   };   
   
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

