'use strict';
/*global navigator*/

document.addEventListener("DOMContentLoaded", () => {
 
  const regex    = RegExp('^/login/.*'),
        loggedIn = regex.test(window.location.pathname);

  const twitter = document.getElementById('login'),
        search  = document.getElementById('search'),
        input   = document.getElementById('location-input'),
        main    = document.getElementById('main'),
        load    = document.getElementById('loading');

  let userId, bars = [];

  const ajax = {
    ready: function ready(fn) {
        
        if (typeof fn !== 'function') return;
        if (document.readyState === 'complete') return fn();

        document.addEventListener('DOMContentLoaded', fn, false);
    },
    request: function ajaxRequest(method, url, data, callback) {
        let xmlhttp = new XMLHttpRequest();

        let params = typeof data == 'string' ? data 
                     : Object.keys(data).map( k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');

        xmlhttp.open(method, url, true);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              let res = JSON.parse(xmlhttp.response);
              
              if(res.statusCode === 400) return alert(res.response.body)
              
              callback(res);
            }
        };

        xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xmlhttp.send(params);
        return xmlhttp;
    }
  };
     
   // load RSVP data to buttons and attach event listener
  function loadBttnEvents() { 
      let twitterBttn = document.getElementsByClassName('bttn'),
          bttnLength  = twitterBttn.length,
          url         = '../api/:id/clicks';
      
      // get all user clicks and match to any applicable business id's
      ajax.ready(ajax.request("GET", url, {}, (clicks) => {
        console.log(clicks)
        clicks.forEach( item => {
          let bttnId = document.getElementById(item.id),
              count;
          console.log(item)
          if(bttnId) {
            // count = 0; 
            // for(var i=0; i < clicks.length; i++) {                      
            //   if(id === clicks[i]) count++;
            // }
            bttnId.innerHTML = item.count;
          };        
        });        
      }));    
      
      // "Going" button returns name of bar and yelp ID and logs info to db 
      for(var i = 0; i < bttnLength; i++) {
                  
        twitterBttn[i].addEventListener('click', function(event) {
          //event.preventDefault();
          if(!userId) return alert('You have to be logged in to perform this action!');
          
          let index = this.getAttribute('data-id');
          bars[index].userId = userId;
          
          // log data to user profile
          ajax.ready(ajax.request("POST", url, bars[index], (bar) => {
            let going = document.getElementById(bar.id),            
                sum   = bar.count === 0 ?  -1 :  1;

            going.innerHTML = (parseInt(going.innerHTML, 10) + sum);            
          }));
          
        }); 
      }; // for(loop) 
   }; // loadBtnEvents()   

  function postResults(locale) { 
    //delete previous bar info if it exists
    if(main.childNodes !== null && main.childNodes.length > 1) {
      while(main.firstChild) {
        main.removeChild(main.firstChild);
      };
    };
    
    const createMainDiv = (obj) => {  
     
      let length = obj.length,
          dist   = obj[length-1].distance,
          city;
       
      for(var i = 0; i < length; i++) {
        let div          = document.createElement("DIV"),
            img_div      = document.createElement('DIV'),
            business_div = document.createElement('DIV'),
            h2_ele       = document.createElement('H2'),
            p_ele        = document.createElement('P'),
            costDescription;
              
        main.appendChild(div);
        div.id                 = 'businesscard_' + i;
        div.className          = 'container'; 
        img_div.className      = 'img-holder';
        business_div.className = 'business';

        let businesscard = document.getElementById(div.id);
        businesscard.appendChild(img_div);
        businesscard.appendChild(business_div);     
       
        let price = obj[i].price;
        if(!price) price = 0;  

        costDescription = {
          0 : 'Unavailable',
          1 : 'Inexpensive',
          2 : 'Moderate',
          3 : 'Pricey',
          4 : 'Ultra High End'
        }         

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
         
        // find closest zip code to coordinates
        if(dist > obj[i].distance) {
          dist = obj[i].distance;
          city = obj[i].location.city;//.zip_code;
        }
         
        // write value of zip code to search bar
        if(i === length -1) {
          if(!input.value) input.placeholder = city;
        }  

        // no image will revert to 'no image available' icon
        if(!obj[i].image_url) obj[i].image_url = '../public/img/NoProductImage_300.jpg';            

        // .img-holder div
        img_div.appendChild(document.createElement('IMG'));
        img_div.firstChild.className = 'img-thumbnail';
        img_div.firstChild.setAttribute('alt', 'image-url');
        img_div.firstChild.setAttribute('src', obj[i].image_url);
        img_div.appendChild(document.createElement('BR'));
        img_div.appendChild(document.createElement('BUTTON'));
        img_div.lastChild.className = "bttn";
        img_div.lastChild.setAttribute('title', 'Let people know that you are going by pushing the button');
        img_div.lastChild.setAttribute('type', 'button');
        img_div.lastChild.setAttribute('value', 'submit');
        img_div.lastChild.setAttribute('data-id', i)
        img_div.lastChild.innerHTML = "Going ";
        img_div.lastChild.appendChild(document.createElement('SPAN'));
        img_div.childNodes[2].lastChild.setAttribute('id', obj[i].id )
        img_div.childNodes[2].lastChild.classList.add('badge');
        img_div.childNodes[2].lastChild.innerHTML = 0;

        // .businsess div - Name of business
        business_div.appendChild(h2_ele).setAttribute('title', 'Visit Website');
        h2_ele.appendChild(document.createElement('A')).setAttribute('href', obj[i].url)
        h2_ele.firstChild.innerHTML = obj[i].name;    
        business_div.appendChild(document.createElement('BR'));       
        // Address
        business_div.appendChild(p_ele).className = 'address';
        p_ele.appendChild(document.createElement('A')).setAttribute('href', "https://www.yelp.com/map/" + obj[i].alias);
        p_ele.firstChild.innerHTML = obj[i].location.address1 + `<br>` 
                                     + obj[i].location.city + `, ` 
                                     + obj[i].location.state + `. ` 
                                     + obj[i].location.zip_code;
        // Telephone
        p_ele.appendChild(document.createElement('BR'));
        p_ele.appendChild(document.createElement('SPAN'));
        p_ele.childNodes[2].classList.add('phone');
        p_ele.childNodes[2].innerHTML = 'Telephone: ';
        p_ele.childNodes[2].setAttribute('href', obj[i].phone);
        p_ele.childNodes[2].setAttribute('title', 'Call Number');
        p_ele.childNodes[2].appendChild(document.createElement('A')).innerHTML = obj[i].display_phone;
        // Price
        p_ele.appendChild(document.createElement('BR'));
        p_ele.appendChild(document.createElement('SPAN')).classList.add('rate');
        p_ele.childNodes[4].innerHTML = "Price: " + price + " " + costDescription[price.length];
        // Ratings       
        p_ele.appendChild(document.createElement('BR'));
        p_ele.appendChild(document.createElement('SPAN'));
        p_ele.childNodes[6].innerHTML = 'Rating: ' + obj[i].rating;         

      }; // for(loop)
        
      loadBttnEvents();
    };   

    let url = '/businesses/search?term=bars&location=';        
    url += typeof locale === 'object' ? locale.latitude + '%20' + locale.longitude 
                                        : locale;
      
    // verify data to be sent;
    let data = !userId ? {} : {user: userId};

    ajax.ready(ajax.request("POST", url, data, (res) => {
      let obj = JSON.parse(res);
      if(load.classList[0] === 'loading') load.classList.remove('loading');
      if(obj.error) return alert(res);
        createMainDiv(obj);
    }));
  }; // postResults()
  
  
  // listener for Twitter login button
  twitter.addEventListener("click", (evt) => {
    evt.preventDefault();
     
    window.location.href = '/auth/twitter';
  });
  
  // listener for Search button
  search.addEventListener("click", (evt) => {
     evt.preventDefault();
    
     load.classList.add('loading');
     let location = input.value;
    
     sessionStorage.setItem('current', location);
     if(bars.length) bars = [];     
     
     return !location? getLocation() : postResults(location);
  });  
  
  // checks if user is logged in /  returns previous session
  if( loggedIn ) {     
    ajax.ready(ajax.request('GET', '/user/location', {}, (req) => {
       
       let user     = req.twitter,
           location = user.previousSession || sessionStorage.getItem('current');
     
       userId = user.id;
    
       return postResults(location || user.location);
    }));
  };
     
  // run if search bar is empty when a search is exec.
  function getLocation(done) {
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
           
          postResults({
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
          });
           
        }, showError);
     } else {
        console.log("Geolocation is not supported by this browser.");
     };
  };
  
   // used in conjunction with getLocation()  
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
  
});

/*
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
*/