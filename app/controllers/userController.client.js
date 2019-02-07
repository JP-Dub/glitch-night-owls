'use strict';
/*global appUrl, ajax, $, navigator*/

(function () {
  
   let login   = document.getElementById('login'),
       search  = document.getElementById('search'),
       main    = document.getElementById('main'),
       message = document.querySelector('#data'),
       bars    = [],;
     
   // pressing the "going" button returns name of bar and yelp ID and should log to db 
   const loadBttnEvents = () => { 
      let twitterBttn = document.getElementsByClassName('bttn'),
          bttnLength = twitterBttn.length;
      
      $.get('api/:id/clicks', (clicks) => {      
        clicks.forEach( id => {
          let bttnId = document.getElementById(id),
              count;
         
          if(bttnId) {
            count = 0; 
            for(var i=0; i < clicks.length; i++) {                      
              if(id === clicks[i]) count++;
            }
            bttnId.innerHTML = count;
          };        
        });              
      });
        
      for(var i = 0; i < bttnLength; i++) {
                  
        twitterBttn[i].addEventListener('click', (event) => {
          //event.preventDefault();
          if(!userId) return alert('You have to be logged in to perform this action!');
          let name = (this.parentNode.parentNode.id).slice(13);// id (number) of businesscard
          
          let logBars = {
                userId : userId,
                name   : bars[name].name,
                id     : bars[name].id
              };
            
          $.post('api/:id/clicks', logBars, (bar) => {
            let going = document.getElementById(bar.id),            
                sum   = bar.count === 0 ?  -1 :  1;
            going.innerHTML = (parseInt(going.innerHTML, 10) + sum);
          });
        }); 
      }; // for(loop) 
   }; // loadBtnEvents()   

   function postResults(locale) { 
     
     // delete previous bar info
     if(main.childNodes.length > 1) {
       while(main.firstChild) {
         main.removeChild(main.firstChild);
       };
     };
     
     let printScreen = function(obj) {   
       let length = obj.length,
           i      = 0;
         
       for(i; i < length; i++) {
         let div       = document.createElement("DIV"),
             imgHolder = document.createElement('DIV'),
             business  = document.createElement('DIV');
           
         main.appendChild(div);
         div.id              = 'businesscard_' + i;
         div.className       = 'container'; 
         imgHolder.className = 'img-holder';
         business.className  = 'business';
         let businesscard    = document.getElementById(div.id);
         businesscard.appendChild(imgHolder);
         businesscard.appendChild(business);
              
         // nightlife cache
         let identity = {
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
           
         let costDescription;
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
         
         $("#businesscard_" + i + "> .img-holder").append("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br><button class='bttn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='" + obj[i].id + "' class='badge'>0</span></button>");
         $("#businesscard_" + i + "> .business").append("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel=" + obj[i].alias + ">" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p>");
           
       }; // for(loop)
        
       loadBttnEvents();
      };   

      let path;
      if(typeof locale === "object") {
        path = '/businesses/search?term=bars&location=' + locale.latitude + '%20' + locale.longitude; 
      } else {
        path = '/businesses/search?term=bars&location=' + locale;
      }      
             
      $.post(path, {user: userId}, function(data) {
         let obj = JSON.parse(data);
         printScreen(obj);
      });
   }; // postResults()
   
   // listener for Twitter login button
   login.addEventListener("click", (event) => {
     event.preventDefault();
     window.location.href = '/auth/twitter';
   });
  
   // listener for Search button
   search.addEventListener("click", (event) => {
      event.preventDefault();
      var location = document.getElementById("location").elements[1].value;
      bars = [];     
      postResults(location);
   }); // search.EventListener()  
   
   // checks if user is logged in /  returns previous session
   if(window.location.pathname === '/loggedUser') {
      $.get('/user/:location', (session) => { 
        let location,  
            user   = session[0].twitter;
            userId = session[0]._id;                   
        
        !user.previousSession ? location = user.location
                              : location = user.previousSession;
                
        $('#searchBar').attr('placeholder', location)
        postResults(location);
      });
   };
     
})();

/*

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
  
    // currently not in use - used in conjunction with getLocation()  
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
   
*/