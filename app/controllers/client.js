document.addEventListener("DOMContentLoaded",function(){function y(a){var f=this,q=document.getElementsByClassName("bttn"),b=q.length;for(a=0;a<b;a++)q[a].addEventListener("click",function(a){a.preventDefault();if(v)return alert("This is the demo version. Please return to home page");if(!k)return alert("You have to be logged in to perform this action!");a={id:f.firstElementChild.getAttribute("id"),name:f.getAttribute("data-name"),userId:k};d.ready(d.request("POST","../rsvp/clicks",a,function(a){var b=
document.getElementById(a.id);b.innerHTML=parseInt(b.innerHTML,10)+a.count}))});if(v)for(a=0;a<b;a++)q[a].firstElementChild.innerHTML=Math.floor(201*Math.random());else d.ready(d.request("GET","../rsvp/clicks",{},function(a){console.log(a);for(var f=0;f<b;f++){for(var g=0,d=q[f].firstElementChild,c=0;c<a.length;c++)d.id===a[c].id&&(g=a[c].count);d.innerHTML=g}}))}function w(a){console.log("locale",a);if(null!==r.childNodes&&1<r.childNodes.length)for(;r.firstChild;)r.removeChild(r.firstChild);var f=
function(f){var b=function(a){return document.createElement(a)},g=f.length,d=f[g-1].distance;"loading"===x.classList.value&&x.classList.remove("loading");var q={0:"Unavailable",1:"Inexpensive",2:"Moderate",3:"Pricey",4:"Ultra High End"};"object"===typeof a&&null!=a&&(f[n].alias=f[n].alias+"?start="+a.latitude+"%20"+a.longitude);for(var n=0;n<g;n++){var c=f[n],k=c.price;k||(k="");if(d>c.distance){d=c.distance;var e=c.location.city}else e=f[g-1].location.city;n===g-1&&(sessionStorage.setItem("current",
p.value||e),p.placeholder=p.value?a:e,p.value="");c.image_url||(c.image_url="../public/img/NoProductImage_300.jpg");var m=b("DIV");e=b("DIV");var l=b("DIV"),t=b("H2"),u=b("H2"),h=b("P");r.appendChild(m);m.id="businesscard_"+n;m.className="container";e.className="img-holder";l.className="business";m=document.getElementById(m.id);m.appendChild(u).setAttribute("class","smallScreen");u.setAttribute("title","Yelp business page");u.appendChild(b("A")).setAttribute("href",c.url);u.firstChild.setAttribute("target",
"_blank");u.firstChild.setAttribute("rel","external");u.firstChild.innerHTML=c.name;m.appendChild(e);m.appendChild(l);e.appendChild(b("IMG"));e.firstChild.className="img-thumbnail";e.firstChild.setAttribute("alt","image-url");e.firstChild.setAttribute("src",c.image_url);e.appendChild(b("BR"));e.appendChild(b("BUTTON"));e.lastChild.className="bttn";e.lastChild.setAttribute("title","Let people know that you are going by pushing the button");e.lastChild.setAttribute("type","button");e.lastChild.setAttribute("value",
"submit");e.lastChild.setAttribute("data-name",c.name);e.lastChild.innerHTML="Going ";e.lastChild.appendChild(b("SPAN"));e.childNodes[2].lastChild.setAttribute("id",c.id);e.childNodes[2].lastChild.classList.add("badge");e.childNodes[2].lastChild.innerHTML=0;l.appendChild(t).setAttribute("class","avgScreen");t.setAttribute("title","Yelp business page");t.appendChild(b("A")).setAttribute("href",c.url);t.firstChild.setAttribute("target","_blank");t.firstChild.setAttribute("rel","external");t.firstChild.innerHTML=
c.name;l.appendChild(h).className="address";h.appendChild(b("A")).setAttribute("href","https://www.yelp.com/map/"+c.alias);h.firstChild.innerHTML=c.location.address1+"<br>"+c.location.city+", "+c.location.state+". "+c.location.zip_code;h.appendChild(b("BR"));h.appendChild(b("SPAN"));h.childNodes[2].classList.add("phone");h.childNodes[2].innerHTML="Telephone: ";h.childNodes[2].setAttribute("href",c.phone);h.childNodes[2].setAttribute("title","Call Number");h.childNodes[2].appendChild(b("A")).innerHTML=
c.display_phone;h.appendChild(b("BR"));h.appendChild(b("SPAN")).classList.add("rate");h.childNodes[4].innerHTML="Price: "+k+" "+q[k.length];h.appendChild(b("BR"));h.appendChild(b("SPAN"));h.childNodes[6].innerHTML="Rating: "+c.rating}y()};"object"===typeof a&&(a=a.latitude+"%20"+a.longitude);d.ready(d.request("POST","/businesses/search?term=bars&location="+a,k?{user:k}:{},function(a){var b=JSON.parse(a);if(b.error)return alert(a);f(b)}))}function z(){function a(a){switch(a.code){case a.PERMISSION_DENIED:console.log("User denied the request for Geolocation.");
break;case a.POSITION_UNAVAILABLE:console.log("Location information is unavailable.");break;case a.TIMEOUT:console.log("The request to get user location timed out.");break;case a.UNKNOWN_ERROR:console.log("An unknown error occurred.")}}navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){w({latitude:a.coords.latitude,longitude:a.coords.longitude})},a):alert("Geolocation is not supported by this browser.")}var l=window.location.pathname,A=/^\/login\/.*/.test(l),v=/^\/rsvp\/.*/.test(l);
l=sessionStorage.getItem("current");var p=document.getElementById("location-input"),x=document.getElementById("load"),r=document.getElementById("main"),B=document.getElementById("search"),C=document.getElementById("login"),k,d={ready:function(a){if("function"===typeof a){if("complete"===document.readyState)return a();document.addEventListener("DOMContentLoaded",a,!1)}},request:function(a,f,d,b){var g=new XMLHttpRequest,k="string"===typeof d?d:Object.keys(d).map(function(a){return encodeURIComponent(a)+
"="+encodeURIComponent(d[a])}).join("&");g.open(a,f,!0);g.onreadystatechange=function(){if(4===g.readyState&&200===g.status){var a=JSON.parse(g.response);if(400===a.statusCode)return alert(a.response.body);b(a)}};g.setRequestHeader("X-Requested-With","XMLHttpRequest");g.setRequestHeader("Content-Type","application/x-www-form-urlencoded");g.send(k);return g}};if(A||v)v?(document.getElementsByTagName("h1")[0].innerHTML="Night Owls Demo",l&&w(l)):d.ready(d.request("GET","/user/location",{},function(a){a=
a.twitter;var d=a.previousSession||sessionStorage.getItem("current");k=a.id;return w(d||a.location)}));C.addEventListener("click",function(a){a.preventDefault();window.location.href="/auth/twitter"});B.addEventListener("click",function(a){a.preventDefault();x.classList.add("loading");return p.value.match(/demo/i)?window.location.href="/rsvp/demo":p.value?w(p.value):z()});setInterval(function(){d.ready(d.request("PUT","/api/resetRSVP",{}))},36E5)});
/*
'use strict';
/*global navigator

document.addEventListener("DOMContentLoaded", () => {
 
  const path     = window.location.pathname,
        loggedIn = RegExp('^/login/.*').test(path),
        demo     = RegExp('^/rsvp/.*').test(path),
        local    = sessionStorage.getItem('current');

  const input   = document.getElementById('location-input'),
        load    = document.getElementById('load'),
        main    = document.getElementById('main'),
        search  = document.getElementById('search'),
        twitter = document.getElementById('login');

  let userId;

  const ajax = {
    ready: function ready(fn) {
        
        if (typeof fn !== 'function') return;
        if (document.readyState === 'complete') return fn();

        document.addEventListener('DOMContentLoaded', fn, false);
    },
    request: function ajaxRequest(method, url, data, callback) {
        let xmlhttp = new XMLHttpRequest();
       
        let params = typeof data === 'string' ? data 
                   : Object.keys(data).map( k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) ).join('&');  
        
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
  function loadBttnEvents(zip) { 
      let rsvpBttn   = document.getElementsByClassName('bttn'),
          bttnLength = rsvpBttn.length,
          url        = '../rsvp/clicks';
    
      // "Going" button returns name of bar and yelp ID and logs info to db 
      for(var i = 0; i < bttnLength; i++) {          
        rsvpBttn[i].addEventListener('click', (evt) => {
          evt.preventDefault();
          
          if( demo ) return alert('This is the demo version. Please return to home page');
          if(!userId) return alert('You have to be logged in to perform this action!');
          
          let obj = {
                id     : this.firstElementChild.getAttribute('id'),
                name   : this.getAttribute('data-name'),
                userId : userId
              };
          
          ajax.ready(ajax.request("POST", url, obj, (bar) => {
            let current = document.getElementById(bar.id)
            current.innerHTML = parseInt(current.innerHTML, 10) + bar.count;           
          }));
          
        }); 
      }; // for(loop)     
    
      if ( demo ) {
        for(let i = 0; i < bttnLength; i++) {
          rsvpBttn[i].firstElementChild.innerHTML = Math.floor(Math.random() * Math.floor(201));
        }
      } else {
        // fetch all user rsvps
        ajax.ready(ajax.request("GET", url, {}, (clicks) => {
          console.log(clicks)
          for(let i = 0; i < bttnLength; i++) {
            let count = 0,
                bttn  = rsvpBttn[i].firstElementChild;
            for(let j = 0; j < clicks.length; j++) {
              if(bttn.id === clicks[j].id) {
                count = clicks[j].count;
              } 
            }
            bttn.innerHTML = count;
          }        
        }));     
      }
      

   }; // loadBtnEvents()   

  // sort data for UI   
  function postResults(locale) { 
    console.log('locale', locale)
    //delete previous bar info if it exists
    if(main.childNodes !== null && main.childNodes.length > 1) {
      while(main.firstChild) {
        main.removeChild(main.firstChild);
      };
    };
    
    const createMainDiv = (obj) => { 
      
      const create = (ele) => document.createElement(ele);
      
      let length = obj.length,
          dist   = obj[length-1].distance,
          costDescription,
          city;
     
      if(load.classList.value === 'loading') load.classList.remove('loading');
      
      costDescription = {
          0 : 'Unavailable',
          1 : 'Inexpensive',
          2 : 'Moderate',
          3 : 'Pricey',
          4 : 'Ultra High End'
        }              

        // if statement used when getLocation() is called prior to loading the screen
        if(typeof locale === "object" && locale != null) {        
          obj[i].alias = obj[i].alias + '?start=' + locale.latitude + '%20' + locale.longitude;
        }
      
      for(var i = 0; i < length; i++) {
        let yelp = obj[i],
            price = yelp.price;
            
        if(!price) price = "";  
         
        // find closest zip code to coordinates
        if(dist > yelp.distance) {
          dist = yelp.distance;
          city = yelp.location.city;       
        } else {
          city = obj[length-1].location.city;
        }
          
        // write value of city or zip code to search bar
        if(i === length -1) {
          sessionStorage.setItem('current', input.value || city);
          input.placeholder = !input.value ? city : locale, input.value = '';   
        }  

        // no image will revert to 'no image available' icon
        if(!yelp.image_url) yelp.image_url = '../public/img/NoProductImage_300.jpg';  
        
        let div           = create("DIV"),
            img_div       = create('DIV'),
            business_div  = create('DIV'),
            h2_ele        = create('H2'),
            smallScreenH2 = create('H2'),
            p_ele         = create('P');           
              
        main.appendChild(div);
        div.id                 = 'businesscard_' + i;
        div.className          = 'container'; 
        img_div.className      = 'img-holder';
        business_div.className = 'business';

        let businesscard = document.getElementById(div.id);
        
        // .smallScreen div, default display:none
        businesscard.appendChild(smallScreenH2).setAttribute('class', 'smallScreen');
        smallScreenH2.setAttribute('title', 'Yelp business page');
        smallScreenH2.appendChild(create('A')).setAttribute('href', yelp.url);
        smallScreenH2.firstChild.setAttribute('target', '_blank');
        smallScreenH2.firstChild.setAttribute('rel', 'external');
        smallScreenH2.firstChild.innerHTML = yelp.name;         
        
        // append .img-holder and .business div to #businesscard_*
        businesscard.appendChild(img_div);
        businesscard.appendChild(business_div);     

        // .img-holder div
        img_div.appendChild(create('IMG'));
        img_div.firstChild.className = 'img-thumbnail';
        img_div.firstChild.setAttribute('alt', 'image-url');
        img_div.firstChild.setAttribute('src', yelp.image_url);
        img_div.appendChild(create('BR'));
        img_div.appendChild(create('BUTTON'));
        img_div.lastChild.className = "bttn";
        img_div.lastChild.setAttribute('title', 'Let people know that you are going by pushing the button');
        img_div.lastChild.setAttribute('type', 'button');
        img_div.lastChild.setAttribute('value', 'submit');
        img_div.lastChild.setAttribute('data-name', yelp.name);
        img_div.lastChild.innerHTML = "Going ";
        img_div.lastChild.appendChild(create('SPAN'));
        img_div.childNodes[2].lastChild.setAttribute('id', yelp.id )
        img_div.childNodes[2].lastChild.classList.add('badge');
        img_div.childNodes[2].lastChild.innerHTML = 0;

        // .businsess div - Name of business
        business_div.appendChild(h2_ele).setAttribute('class', 'avgScreen');
        h2_ele.setAttribute('title', 'Yelp business page');
        h2_ele.appendChild(create('A')).setAttribute('href', yelp.url);
        h2_ele.firstChild.setAttribute('target', '_blank');
        h2_ele.firstChild.setAttribute('rel', 'external');
        h2_ele.firstChild.innerHTML = yelp.name;          
        // Address
        business_div.appendChild(p_ele).className = 'address';
        p_ele.appendChild(create('A')).setAttribute('href', "https://www.yelp.com/map/" + yelp.alias);
        p_ele.firstChild.innerHTML = yelp.location.address1 + `<br>` 
                                     + yelp.location.city + `, ` 
                                     + yelp.location.state + `. ` 
                                     + yelp.location.zip_code;
        // Telephone
        p_ele.appendChild(create('BR'));
        p_ele.appendChild(create('SPAN'));
        p_ele.childNodes[2].classList.add('phone');
        p_ele.childNodes[2].innerHTML = 'Telephone: ';
        p_ele.childNodes[2].setAttribute('href', yelp.phone);
        p_ele.childNodes[2].setAttribute('title', 'Call Number');
        p_ele.childNodes[2].appendChild(create('A')).innerHTML = yelp.display_phone;
        // Price
        p_ele.appendChild(create('BR'));
        p_ele.appendChild(create('SPAN')).classList.add('rate');
        p_ele.childNodes[4].innerHTML = "Price: " + price + " " + costDescription[price.length];
        // Ratings       
        p_ele.appendChild(create('BR'));
        p_ele.appendChild(create('SPAN'));
        p_ele.childNodes[6].innerHTML = 'Rating: ' + yelp.rating;         

      }; // for(loop)
      
      loadBttnEvents();
    };   
  
    if(typeof locale === 'object') locale = locale.latitude + '%20' + locale.longitude; 
    let url = '/businesses/search?term=bars&location=' + locale;      
    
    // verify if data to be sent
    let data = !userId ? {} : {user: userId};

    ajax.ready(ajax.request("POST", url, data, (res) => {
      let obj = JSON.parse(res);
      if(obj.error) return alert(res);
        createMainDiv(obj);
    }));
  }; // postResults()
  
  // run if search bar is empty when a search is exec.
  function getLocation() {
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
           
          postResults({
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
          });
           
        }, showError);
     } else {
        alert("Geolocation is not supported by this browser.");
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
  };
  
  // checks if user is logged in /  returns previous session
  if( loggedIn || demo) {  
    if(demo) {
      document.getElementsByTagName('h1')[0].innerHTML = 'Night Owls Demo';
      if (local) postResults(local);
  
    } else {
    
      ajax.ready(ajax.request('GET', '/user/location', {}, (req) => {

         let user     = req.twitter,
             location = user.previousSession || sessionStorage.getItem('current');     
             userId   = user.id;

         return postResults(location || user.location);
      }));
    }
  };
  
  // listener for Twitter login button
  twitter.addEventListener("click", (evt) => {
    evt.preventDefault();
     
    window.location.href = '/auth/twitter';
  });
  
  // listener for Search button
  search.addEventListener("click", (evt) => {
     evt.preventDefault();
    
     load.classList.add('loading');
    
     if(input.value.match(/demo/i)) return window.location.href = '/rsvp/demo';
     
     return !input.value? getLocation() : postResults(input.value);
  });  
  
  // interval checks time once an hour, clears all user RSVP's daily
  setInterval(() => {
    ajax.ready(ajax.request('PUT', '/api/resetRSVP', {}));    
  }, 3600000);
  
  
});
*/