
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import '../public/css/style.css';
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

    componentDidMount() {}

    componentWillUnmount() {
        this.enterBttn.removeEventListener('keydown', (bttn) => {

        })
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

    // submitHandler(evt) {
    //     evt.preventDefault();
    //     //if(bars.length) bars = [];
    //     postResults(this.state.value);    
    //  }

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
                                    <span className="glyphicon glyphicon-search"></span>
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


// class Results extends Component {
//     constructor(props) {
//         super(props);
//     }

//     componentDidMount() {

        
//         return(
//             <div className='container'>
//                 <div className='img-holder'>
                    
//                 </div>
//                 <div className='business'>

//                 </div>
//             </div>
//         )
//     }

 
//     render() {

//     return(
//         <ErrorBoundary>
//             <div id='main'>
//                 {searchResults}
//             </div>
//         </ErrorBoundary>
//     )
//    }
// }

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


class Hello extends Component {
 render() {
  return (<h1>Hello</h1>)
  }
}

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path='/' strict component={App} />
        <Route path='/login/*' component={Hello} />
      </BrowserRouter>
      );
  }
}

ReactDOM.render(
    <Main />, 
    document.getElementById('root')
);

/*
// Configure ajax call
const ajax = {
    ready: function ready (fn) {
  
        if (typeof fn !== 'function') return;
        if (document.readyState === 'complete') return fn();
  
        document.addEventListener('DOMContentLoaded', fn, false);
    },
    request: function ajaxRequest (method, url, data, callback) {
        var xmlhttp = new XMLHttpRequest();
        //rconsole.log('data', data)

        var params = typeof data == 'string' ? data 
                     : Object.keys(data).map( k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
        //console.log('params', params)
        
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
*/

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