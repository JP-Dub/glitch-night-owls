
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import '../public/css/style.css';
import Login from '../public/login.js';
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
        <Switch>
        <Route exact path='/' strict component={App} />
        <Route path='/login' component={Hello} />
        </Switch>
      </BrowserRouter>
      );
  }
}

ReactDOM.render(
    <Main />, 
    document.getElementById('root')
);