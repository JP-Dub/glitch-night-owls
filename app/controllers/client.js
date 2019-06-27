'use strict';
/*global appUrl, ajax, $, navigator*/
console.log(window.location.pathname
document.addEventListener("DOMContentLoaded", () => {
//$(document).ready(function() {
const search = document.getElementById('search'),
      input  = document.getElementById('input'),
      main   = document.getElementById('main');

let userId, bars = [];

const ajax = {
  ready: function ready (fn) {

      if (typeof fn !== 'function') return;
      if (document.readyState === 'complete') return fn();

      document.addEventListener('DOMContentLoaded', fn, false);
  },
  request: function ajaxRequest (method, url, data, callback) {
      let xmlhttp = new XMLHttpRequest();
     

      let params = typeof data == 'string' ? data 
                   : Object.keys(data).map( k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
      
      xmlhttp.open(method, url, true);

      xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(JSON.parse(xmlhttp.response));
          }
      };

      xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      xmlhttp.send(params);
      return xmlhttp;
  }
};
     
   // pressing the "going" button returns name of bar and yelp ID and should log to db 
   function loadBttnEvents() { 
      let twitterBttn = document.getElementsByClassName('bttn'),
          bttnLength  = twitterBttn.length,
          url         = 'api/:id/clicks';
      

      ajax.ready(ajax.request("GET", url, {}, (clicks) => {
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
      }))    
      // $.get('api/:id/clicks', (clicks) => {      
      //   clicks.forEach( id => {
      //     let bttnId = document.getElementById(id),
      //         count;
         
      //     if(bttnId) {
      //       count = 0; 
      //       for(var i=0; i < clicks.length; i++) {                      
      //         if(id === clicks[i]) count++;
      //       }
      //       bttnId.innerHTML = count;
      //     };        
      //   });              
      // });
        
      for(var i = 0; i < bttnLength; i++) {
                  
        twitterBttn[i].addEventListener('click', function(event) {
          //event.preventDefault();
          if(!userId) return alert('You have to be logged in to perform this action!');
          
          let index = (this.parentNode.parentNode.id).slice(13);// id (number) of businesscard
          bars[index].userId = userId;

          ajax.ready(ajax.request("POST", url, bars[index], (bar) => {
            let going = document.getElementById(bar.id),            
                sum   = bar.count === 0 ?  -1 :  1;

            going.innerHTML = (parseInt(going.innerHTML, 10) + sum);            
          }))
          
          // $.post('api/:id/clicks', bars[index], (bar) => {
          //   let going = document.getElementById(bar.id),            
          //       sum   = bar.count === 0 ?  -1 :  1;

          //   going.innerHTML = (parseInt(going.innerHTML, 10) + sum);
          // });
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
     
     let printScreen = (obj) => {   
       let length = obj.length,
           i      = 0;
      //console.log(obj)
       for(i; i < length; i++) {
        let div     = document.createElement("DIV"),
        img_div = document.createElement('DIV'),
        business_div  = document.createElement('DIV'),
        h2_ele = document.createElement('H2'),
        p_ele  = document.createElement('P'),
        costDescription;
               
        main.appendChild(div);
        div.id                 = 'businesscard_' + i;
        div.className          = 'container'; 
        img_div.className      = 'img-holder';
        business_div.className = 'business';
        
        let businesscard    = document.getElementById(div.id);
        businesscard.appendChild(img_div);
        businesscard.appendChild(business_div);     
        
        if(!obj[i].price) {
            obj[i].price = '';         
        }
 
        costDescription = {
            '$'   : 'Inexpensive',
            '$$'  : 'Moderate',
            '$$$' : 'Pricey',
            '$$$$': 'Ultra High End',
            ''    : 'Unavailable'
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
           
         // no image will revert to 'no image available' icon
         if(!obj[i].image_url) obj[i].image_url = '../public/img/NoProductImage_300.jpg';            
          
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
         img_div.lastChild.innerHTML = "Going ";
         img_div.lastChild.appendChild(document.createElement('SPAN'));
         img_div.childNodes[2].lastChild.setAttribute('id', obj[i].id )
         img_div.childNodes[2].lastChild.classList.add('badge');
         img_div.childNodes[2].lastChild.innerHTML = 0;
             
     
         business_div.appendChild(h2_ele).setAttribute('title', 'Visit Website');
         h2_ele.appendChild(document.createElement('A')).setAttribute('href', obj[i].url)
         h2_ele.firstChild.innerHTML = obj[i].name;
         
         business_div.appendChild(document.createElement('BR'));
         business_div.appendChild(p_ele).className = 'address';
         
         p_ele.appendChild(document.createElement('A')).setAttribute('href', "https://www.yelp.com/map/" + obj[i].alias);
         p_ele.firstChild.innerHTML = obj[i].location.address1 + `<br>` 
                                      + obj[i].location.city + `, ` 
                                      + obj[i].location.state + `. ` 
                                      + obj[i].location.zip_code;
                        
         p_ele.appendChild(document.createElement('BR'));
         p_ele.appendChild(document.createElement('SPAN'));
         p_ele.childNodes[2].classList.add('phone');
         p_ele.childNodes[2].innerHTML ='Telephone:';
         p_ele.childNodes[2].setAttribute('href', obj[i].phone);
         p_ele.childNodes[2].setAttribute('title', 'Call Number');
         p_ele.childNodes[2].appendChild(document.createElement('A')).innerHTML = obj[i].display_phone;
 
         p_ele.appendChild(document.createElement('BR'));
         p_ele.appendChild(document.createElement('SPAN')).classList.add('rate');
         p_ele.childNodes[4].innerHTML = "Price: " + obj[i].price + " " + costDescription[obj[i].price];
         
         p_ele.appendChild(document.createElement('BR'));
         p_ele.appendChild(document.createElement('SPAN'));
         p_ele.childNodes[6].innerHTML = 'Rating: ' + obj[i].rating;         


         //$("#businesscard_" + i + "> .img-holder").append("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br><button class='bttn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='" + obj[i].id + "' class='badge'>0</span></button>");
         //$("#businesscard_" + i + "> .business").append("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel=" + obj[i].alias + ">" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p>");
           
       }; // for(loop)
        
       loadBttnEvents();
      };   

      let url = '/businesses/search?term=bars&location=';        
      url += typeof locale === 'object' ? locale.latitude + '%20' + locale.longitude 
                                        : locale;
      // $.post(url, {user: userId}, function(data) {
      //    let obj = JSON.parse(data);
      //    if(obj.error) return alert(data)
      //    printScreen(obj);
      // });

      // verify data to be sent;
      let data = !userId ? {} : {user: userId};

      ajax.ready(ajax.request("POST", url, data, (res) => {
        let obj = JSON.parse(res);
        if(obj.error) return alert(res);
        printScreen(obj);
      }))
   }; // postResults()
   
/* 
   // listener for Twitter login button
   twitter.addEventListener("click", (evt) => {
     evt.preventDefault();
     window.location.href = '/auth/twitter';
   });
*/

   // listener for Search button
   search.addEventListener("click", (evt) => {
      evt.preventDefault();
      let location = document.getElementById("location").elements[1].value;
      if(bars.length) bars = [];     
      !location? getLocation() : postResults(location);
   }); // search.EventListener()  

       
   // checks if user is logged in /  returns previous session
   let regex = RegExp('^/login/.*');
   if( regex.test(window.location.pathname) ) {
  
     ajax.ready(ajax.request('GET', '/user/:location', {}, (session) => {
     // $.get('/user/:location', (session) => { 
        let user     = session[0].twitter;
            userId   = session[0]._id,                   
            location = !user.previousSession ? user.location
                                             : user.previousSession;

        input.setAttribute('placeholder', location)                      
                
        //$('#searchBar').attr('placeholder', location)
        postResults(location);
     }));
   };
     

   // currently not in use
   function getLocation(done) {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
            var obj = {};
            obj.latitude = position.coords.latitude;
            obj.longitude = position.coords.longitude;
            postResults(obj);
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
   //getLocation()
  });












// 'use strict';
// /*global appUrl, ajax, $, navigator*/
  
//    let search = document.getElementById('search'),
//        login  = document.getElementById('login'),
//        main   = document.getElementById('main'),
//        bars   = [],
//        userId;
     
//    // pressing the "going" button returns name of bar and yelp ID and should log to db 
//    function loadBttnEvents() { 
//       let twitterBttn = document.getElementsByClassName('bttn'),
//           bttnLength = twitterBttn.length;
      
//       $.get('api/:id/clicks', (clicks) => {      
//         clicks.forEach( id => {
//           let bttnId = document.getElementById(id),
//               count;
         
//           if(bttnId) {
//             count = 0; 
//             for(var i=0; i < clicks.length; i++) {                      
//               if(id === clicks[i]) count++;
//             }
//             bttnId.innerHTML = count;
//           };        
//         });              
//       });
        
//       for(var i = 0; i < bttnLength; i++) {
                  
//         twitterBttn[i].addEventListener('click', function(event) {
//           //event.preventDefault();
//           if(!userId) return alert('You have to be logged in to perform this action!');
          
//           let index = (this.parentNode.parentNode.id).slice(13);// id (number) of businesscard
//           bars[index].userId = userId;
          
//           $.post('api/:id/clicks', bars[index], (bar) => {
//             let going = document.getElementById(bar.id),            
//                 sum   = bar.count === 0 ?  -1 :  1;
//             going.innerHTML = (parseInt(going.innerHTML, 10) + sum);
//           });
//         }); 
//       }; // for(loop) 
//    }; // loadBtnEvents()   

//    function postResults(locale) { 
     
//      // delete previous bar info
//      if(main.childNodes.length > 1) {
//        while(main.firstChild) {
//          main.removeChild(main.firstChild);
//        };
//      };
     
//      let printScreen = (obj) => {   
//        let length = obj.length,
//            i      = 0;
         
//        for(i; i < length; i++) {
//          let div       = document.createElement("DIV"),
//              imgHolder = document.createElement('DIV'),
//              business  = document.createElement('DIV');
           
//          main.appendChild(div);
//          div.id              = 'businesscard_' + i;
//          div.className       = 'container'; 
//          imgHolder.className = 'img-holder';
//          business.className  = 'business';
//          let businesscard    = document.getElementById(div.id);
//          businesscard.appendChild(imgHolder);
//          businesscard.appendChild(business);
              
//          // nightlife cache
//          let identity = {
//            "id"  : obj[i].id,
//            "name": obj[i].name
//            };
            
//          bars.push(identity);
            
//          // if statement used when getLocation() is called prior to loading the screen
//          if(typeof locale === "object" && locale != null) {
//            obj[i].alias = obj[i].alias + '?start=' + locale.latitude + '%20' + locale.longitude;
//          }
           
//          // no image will revert to 'no image available' icon
//          if(!obj[i].image_url) obj[i].image_url = '../public/img/NoProductImage_300.jpg';            
           
//          let costDescription;
//          switch(obj[i].price) {
//            case "$":
//              costDescription = "Inexpensive";
//              break;
//            case "$$":
//              costDescription = "Moderate";
//              break;
//            case "$$$":
//              costDescription = "Pricey";
//              break;
//            case "$$$$":
//              costDescription = "Ultra High End";
//              break;
//            default:
//              obj[i].price = '';
//              costDescription = "Unavailable";
//              break;
//          };
         
//          $("#businesscard_" + i + "> .img-holder").append("<img src=" + obj[i].image_url + " class='img-thumbnail' alt='image_url'><br><button class='bttn' title='Let people know that you are going by pushing the button' type='button' value='submit'>Going <span id='" + obj[i].id + "' class='badge'>0</span></button>");
//          $("#businesscard_" + i + "> .business").append("<h2 title='Visit Website'><a href=" + obj[i].url + " target='_blank'>" + obj[i].name + "</a></h2><br><p class='address'><a href='https://www.yelp.com/map/" + obj[i].alias + "' target='_blank' title='Get Directions' rel=" + obj[i].alias + ">" + obj[i].location.address1 + "<br>" + obj[i].location.city + ", " + obj[i].location.state + ". " + obj[i].location.zip_code + "</a><br><span class='phone'>Telephone: <a href='tel:" + obj[i].phone + "' target='_blank' title='Call Number'>" + obj[i].display_phone + "</a></span><br><span class='rate'>Price: " + obj[i].price + " " + costDescription + "</span><br><span>Rating: " + obj[i].rating + "</span></p>");
           
//        }; // for(loop)
        
//        loadBttnEvents();
//       };   

//       let path;
//       if(typeof locale === "object") {
//         path = '/businesses/search?term=bars&location=' + locale.latitude + '%20' + locale.longitude; 
//       } else {
//         path = '/businesses/search?term=bars&location=' + locale;
//       }      
             
//       $.post(path, {user: userId}, function(data) {
//          let obj = JSON.parse(data);
//          printScreen(obj);
//       });
//    }; // postResults()
   
//    // listener for Twitter login button
//    login.addEventListener("click", (event) => {
//      event.preventDefault();
//      window.location.href = '/auth/twitter';
//    });
  
//    // listener for Search button
//    search.addEventListener("click", (event) => {
//       event.preventDefault();
//       let location = document.getElementById("location").elements[1].value;
//       bars = [];     
//       postResults(location);
//    }); // search.EventListener()  
   
//    // checks if user is logged in /  returns previous session
//    if(window.location.pathname === '/loggedUser') {
//       $.get('/user/:location', (session) => { 
//         let location,  
//             user   = session[0].twitter;
//             userId = session[0]._id;                   
        
//         !user.previousSession ? location = user.location
//                               : location = user.previousSession;
                
//         $('#searchBar').attr('placeholder', location)
//         postResults(location);
//       });
//    };
     


// /*

//    // currently not in use
//    function getLocation(done) {
//       if (navigator.geolocation) {
//          navigator.geolocation.getCurrentPosition(function(position) {
//             var obj = {};
//             obj.latitude = position.coords.latitude;
//             obj.longitude = position.coords.longitude;
//             done(obj);
//          }, showError);
//       } else {
//          console.log("Geolocation is not supported by this browser.");
//       };
//    };
  
//     // currently not in use - used in conjunction with getLocation()  
//    function showError(error) {
//       switch(error.code) {
//          case error.PERMISSION_DENIED:
//             console.log("User denied the request for Geolocation.");
//             break;
//          case error.POSITION_UNAVAILABLE:
//             console.log("Location information is unavailable.");
//             break;
//          case error.TIMEOUT:
//             console.log("The request to get user location timed out.");
//             break;
//          case error.UNKNOWN_ERROR:
//             console.log("An unknown error occurred.");
//             break;
//       };
//    };
   
// */