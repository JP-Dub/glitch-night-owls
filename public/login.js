import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import '../public/css/style.css';
import noImage from '../public/img/NoProductImage_300.jpg';

console.log(window.location.pathname)

export default class App extends Component {
    constructor(props) {
        super(props);
        this.changeHandler  = this.changeHandler.bind(this);
        this.twitterHandler = this.twitterHandler.bind(this);
        //this.submitHandler  = this.submitHandler.bind(this);
        this.state = {
            value: ""
        }
    }

    componentDidMount() {
        this.bars = [],
        this.userId = '';
        this.searchInput = document.getElementById('search'),

        this.searchInput.addEventListener('click', (evt)  => {
            evt.preventDefault();

            let location = document.getElementById("location").elements[1].value;
            if(this.bars.length) this.bars = [];     
            !location ? this.getLocation( geoLocation => this.yelpHandler(geoLocation)) 
                      : this.yelpHandler(location);            
        });        
    }

    componentWillUnmount() {
    }
    
    changeHandler(evt) {
        evt.preventDefault();
        
        this.setState({
            value: evt.target.value
          });
    }  

    twitterHandler(evt) {
        evt.preventDefault();

        //window.location.href = '/auth/twitter';
        window.location.assign('/auth/twitter');
    }

    yelpHandler(locale) {
        //delete previous bar info if it exists
      // const main = document.getElementById('main');
      //   if(main.childNodes !== null && main.childNodes.length > 1) {
      //       while(main.firstChild) {
      //       main.removeChild(main.firstChild);
      //       };
      //   };
        //console.log('yelpHandler', locale)
        let url = '/businesses/search?term=bars&location=';        
        url += typeof locale === 'object' ? locale.latitude + '%20' + locale.longitude 
                                          : locale;
        
        let data = !this.userId ? {} : {user: this.userId};
       
        ajax.ready(ajax.request("POST", url, data, (res) => {
            let obj = JSON.parse(res);
            if(obj.error) return alert(res);
                //Search(obj, this.bars);

            ReactDOM.render(
                <SearchResults 
                    data={obj}
                    bars={this.bars}
                    searchLocation={locale} />,
                    document.getElementById('main')
            );
               
            this.loadBttnEvents();                
        }));
    }

    loadBttnEvents() {
        let twitterBttn = document.getElementsByClassName('bttn'),
            bttnLength  = twitterBttn.length,
            url         = 'api/:id/clicks';

        ajax.ready(ajax.request("GET", url, {}, (clicks) => {
            clicks.forEach( id => {
                let bttnId = document.getElementById(id),
                    count  = 0;
            
                if(bttnId) {
                    //count=0;
                    for(var i=0; i < clicks.length; i++) {                      
                        if(id === clicks[i]) count++;
                    }
                    bttnId.innerHTML = count;
                };       
            });        
        }));          
        
        for(var i = 0; i < bttnLength; i++) {                  
            twitterBttn[i].addEventListener('click', function(event) {
                //event.preventDefault();
                
                if(!this.userId) return alert('You have to be logged in to perform this action!');
                
                let index = (this.parentNode.parentNode.id).slice(13);// id (number) of businesscard
                this.bars[index].userId = this.userId;
                
                ajax.ready(ajax.request("POST", url, this.bars[index], (bar) => {
                let going = document.getElementById(bar.id),            
                    sum   = bar.count === 0 ?  -1 :  1;

                going.innerHTML = (parseInt(going.innerHTML, 10) + sum);            
                }))

            }); 
        }; // for(loop)         
    }

    getLocation(next) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var obj = {};
                obj.latitude = position.coords.latitude;
                obj.longitude = position.coords.longitude;
               
                next(obj);
        }, showError);
        } else {
        console.log("Geolocation is not supported by this browser.");
        };

        const showError = (error) => {
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

    }      

    render() {
        return (
            <ErrorBoundary>
                <div id ="heading" className="container">
                    <h1>Night Owls</h1>
                    <p>The only app that lets you know where the party's at!</p>
                    <form id="location">
                        <div className="input-group">
                            <div className="input-group-btn">
                                <button id="login" 
                                        className="btn btn-default" 
                                        type="button" 
                                        title='Twitter'
                                        onClick={this.twitterHandler}>
                                    <i className="fa fa-twitter"></i>
                                </button>
                            </div>
                            <input id="input" 
                                   className="form-control"  
                                   type="text" 
                                   placeholder="Search location" 
                                   value={this.state.value}
                                   onChange={this.changeHandler} 
                                   required/>
                            <div className="input-group-btn">
                                <button id="search" 
                                        className="btn btn-default" 
                                        type="submit">    
                                    <span className="glyphicon glyphicon-search" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <br />
                <div id="main"/>
                <br />
                <p id="credit">Powered by Yelp&copy; Fusion | jDub's Code Studio&copy; 2019 | font courtesy of <a href="https://www.fontspring.com/">Fontspring</a></p>
            </ErrorBoundary>
        )
    }
}

const SearchResults =  (props) => {
    let obj    = props.data,
        locale = props.searchLocation;

    const costDescription = {
            '$'   : 'Inexpensive',
            '$$'  : 'Moderate',
            '$$$' : 'Pricey',
            '$$$$': 'Ultra High End',
            ''    : 'Unavailable'
    };
    
    const data = function(arr) {
        const results = arr.map( (key, i) => {
            
            if(!obj[i].price) {
                obj[i].price = '';         
            }

            // nightlife cache
            let identity = {
                "id"  : obj[i].id,
                "name": obj[i].name
                };
                
            props.bars.push(identity);
            
            // check if var locale is object
            if(locale) {
                obj[i].alias += '?start=';
                obj[i].alias += typeof locale === 'object' ? locale.latitude + '%20' + locale.longitude
                                                           : locale;
            }

            // no image will revert to 'no image available' icon
            if(!obj[i].image_url) obj[i].image_url = noImage;             
            
            var businesscard = 'businesscard_' + i;
            return (
                <div id={businesscard} className='container' key={i}>
                    <div className='img-holder'>
                        <img className='img-thumbnail' 
                                alt='img-url'
                                src={obj[i].image_url} />
                        <br />
                        <button className='bttn'
                                title='Let people know you are going by pushing the button'
                                type='button'
                                value='submit'>Going <span id={obj[i].id} className='badge'>0</span>
                        </button>
                    </div>
                    <div className='business'>
                        <h2 title='Visit Website'>
                            <a href={obj[i].url}
                               target='_blank'
                               rel='external'
                               dangerouslySetInnerHTML={{__html: obj[i].name}} />
                        </h2>
                        <br />
                        <p className='address'>
                            <a href={'https://www.yelp.com/map/' + obj[i].alias}
                                target='_blank'
                                title='Get Directions'
                                rel='external'
                                dangerouslySetInnerHTML={{__html:  
                                    obj[i].location.address1 + `.<br>` 
                                    + obj[i].location.city + `, ` 
                                    + obj[i].location.state + `. ` 
                                    + obj[i].location.zip_code }} />
                            <br />
                            <span className='phone'>Telephone:
                            <a href={obj[i].phone}
                                target='_blank'
                                title='Call Number'
                                dangerouslySetInnerHTML={{__html:
                                    ` ` + obj[i].display_phone}} />
                            </span>
                            <br />
                            <span className='rate'
                                  dangerouslySetInnerHTML={{__html:
                                    `Price: ` + obj[i].price + ` `  + costDescription[obj[i].price] }} />
                            <br />
                            <span dangerouslySetInnerHTML={{__html: 
                                    `Rating: `+ obj[i].rating}} />
                        </p>
                    </div>
                </div>
            )
        })
        
        return (
            <div>{results}</div>
        );        
    }

    return (
        <div>
            {data(obj)}
        </div>
    );
 
}

// Error class React Component
class ErrorBoundary extends Component {
		
		constructor(props) {
			super(props);
			this.state = { hasError: false };
		}
    
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
		
    componentDidCatch(error, info) {
			// Display fallback UI
			this.setState({ hasError: true });
			// log the error to console 
			console.log(error, info);   
		}
		render() {
			if (this.state.hasError) {
				// You can render any custom fallback UI
				return <h3>Um...Something went wrong.</h3>;
			}
			return this.props.children;
		};
}; 

// Configure ajax call
const ajax = {
    ready: function ready (fn) {
  
        if (typeof fn !== 'function') return;
        if (document.readyState === 'complete') return fn();
  
        document.addEventListener('DOMContentLoaded', fn, false);
    },
    request: function ajaxRequest (method, url, data, callback) {
        var xmlhttp = new XMLHttpRequest();

        var params = typeof data == 'string' ? data 
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

class Main extends Component {
    render() {
      return (
        <BrowserRouter>
          <Switch>
          <Route exact path='/' strict component={App} />
          <Route path='/login' render={ () => {
              return (<h1>Hello!</h1>)
              }} />
          </Switch>
        </BrowserRouter>
        );
    }
  }
  
ReactDOM.render(
    <Main />, 
    document.getElementById('root')
);

/*
    componentDidMount() {
        // this.enterBttn = document.getElementById('searchBar');
        // this.enterBttn.addEventListener('keydown', (bttn) => {
        //     console.log(bttn)
        //     if(bttn.key === '9') {
        //    bttn.preventDefault();
        //    let location = document.getElementById("location").elements[1].value;
        //    console.log('location', location)
        //    let bars = [];     
        //     postResults(location);
        //     }
        // })
        
        // // listener for Twitter login button
        // twitter.addEventListener("click", (evt) => {
        //     evt.preventDefault();
        //     window.location.href = '/auth/twitter';
        // });
  
        // // listener for Search button
        // search.addEventListener("click", (evt) => {
        //     evt.preventDefault();
     
        //     let location = document.getElementById("location").elements[1].value;
        //     bars = [];     
        //     postResults(location);
        // }); // search.EventListener()  
    }
*/

/*
class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search : '',
            input  : '',
            main   : ''
        };
    }

    componentDidMount() {
        this.bars = [],
        this.userId = '';
        this.setState({
            search : document.getElementById('search'),
            input  : document.getElementById('input'),
            main   : document.getElementById('main'), 
        });

        this.state.search.addEventListener('click', (evt)  => {
            evt.preventDefault();
            let location = document.getElementById("location").elements[1].value;
            if(this.bars.length) this.bars = [];     
            !location? getLocation() : this.postResults(location);            
        });

    }

    loadBttnEvents() {
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
        }));    
        
        for(var i = 0; i < bttnLength; i++) {              
            twitterBttn[i].addEventListener('click', function(event) {
                //event.preventDefault();
                if(!this.userId) return alert('You have to be logged in to perform this action!');
                
                let index = (this.parentNode.parentNode.id).slice(13);// id (number) of businesscard
                this.bars[index].userId = this.userId;

                ajax.ready(ajax.request("POST", url, this.bars[index], (bar) => {
                let going = document.getElementById(bar.id),            
                    sum   = bar.count === 0 ?  -1 :  1;

                going.innerHTML = (parseInt(going.innerHTML, 10) + sum);            
                }));
            }); 
        }; // for(loop)         
    }

    postResults(locale) {
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
                
            this.bars.push(identity);
                
            // if statement used when getLocation() is called prior to loading the screen
            if(typeof locale === "object" && locale != null) {
                obj[i].alias = obj[i].alias + '?start=' + locale.latitude + '%20' + locale.longitude;
            }
                
            // no image will revert to 'no image available' icon
            if(!obj[i].image_url) obj[i].image_url = '../src/img/NoProductImage_300.jpg';            
            
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
            }; // for(loop)
            
            this.loadBttnEvents();
        };   
    
        let url = '/businesses/search?term=bars&location=';        
        url += typeof locale === 'object' ? locale.latitude + '%20' + locale.longitude 
                                            : locale;
    
        // verify data to be sent;
        let data = !this.userId ? {} : {user: userId};
    
        ajax.ready(ajax.request("POST", url, data, (res) => {
            let obj = JSON.parse(res);
            if(obj.error) return alert(res);
            printScreen(obj);
        }))        
    }

    
    render() {

    return(
        <ErrorBoundary>
            <div id='main'>
                {searchResults}
            </div>
        </ErrorBoundary>
    )
   }
}
*/

/*
// function getLocation(done) {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             var obj = {};
//             obj.latitude = position.coords.latitude;
//             obj.longitude = position.coords.longitude;
//             this.postResults(obj);
//        }, showError);
//     } else {
//        console.log("Geolocation is not supported by this browser.");
//     };
// };

//   // currently not in use - used in conjunction with getLocation()  
// function showError(error) {
//     switch(error.code) {
//         case error.PERMISSION_DENIED:
//             console.log("User denied the request for Geolocation.");
//             break;
//         case error.POSITION_UNAVAILABLE:
//             console.log("Location information is unavailable.");
//             break;
//         case error.TIMEOUT:
//             console.log("The request to get user location timed out.");
//             break;
//         case error.UNKNOWN_ERROR:
//             console.log("An unknown error occurred.");
//             break;
//     };
// };
*/