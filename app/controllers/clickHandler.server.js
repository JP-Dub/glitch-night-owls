'use strict';

var Users = require('../models/users.js');
var yelp = require('yelp-fusion');

function ClickHandler () {
	
	this.getClicks = function (req, res) {
		console.log('getClicks', req.query)
		Users
			.find({}).select({ nightlife: 1, _id: false })
			.exec(function (err, result) {
				if (err) { throw err; }
        console.log('getClicks results', result)
				res.json(result);
			});
	};

	this.addClick = function (req, res) {
		console.log('addClicks', req.query, req.body)
		Users
			.findOne({'_id': req.body.userId}).select({'twitter.nightlife.id': req.body.id})
			.exec(function (err, result) {
					if (err) throw err; 
          console.log('result', result)
          
         if(result) {
            let obj = { 
              id    : req.body.id,
              name  : req.body.name,
              count : 1
              };
            result.twitter.nightlife.push(obj);
          
            result.save( (err, user) => {
              if(err) throw err;
              //console.log(user)
              res.json(user)
            });            
         }

			});
	};
	
	
	// queries the Yelp api and stores session data and location
	this.getNightlife = function(req, res) {
		//console.log('this.getnightlife', req.user, req.params, req.query, req.body)
		 var Client = yelp.client(process.env.API_KEY);
     var request = {
        		term    : 'bars',
    	    	location: req.query.location,
            sort_by : 'rating',
            limit   : 20,
        	};
     console.log('this.getNightLife', req.body)
     if(!req.body.user) {
       Users.findOneAndUpdate({
             _id: '5c59ed1e9148306b65d5a1a3'
            }, {
             session: req.query.location
            }, {
             upsert: true,
             new   : true
            })
            .exec( (err, logged) => {
              if(err) throw err; 
            });
     } else {
       Users.findOneAndUpdate({ 
            'twitter.id' : req.body.user
            }, {
            'twitter.previousSession' : req.query.location
            }, {
            new   : true, 
            upsert: true
            })
          	.exec(function(err, success){
             	if(err) return console.error(err);
              //console.log('users or', success)
        	  });    
     };
        
      // Yelp api	
     Client.search(request).then(response => {
       var results = response.jsonBody.businesses,
           json    = JSON.stringify(results, null, 4);
           //console.log('yelp', json)
          //json[0].id
           res.json(json);
     }).catch(error => {
       	res.end("We apologize, there has been an error processing your request. Error message: " + error);
    }); 
	};
	
	// returns the user location and cached search results after twitter log in
	this.userLocation = function(req, res) {
    console.log("userLocation")
		Users.find({_id: req.user._id})
			.exec(function(err, user){
				if(err) throw err;       
      
				res.json(user);
			});
	};
  
  // records current search location
  // this.logUserLocale = (req, res) => {
  //   console.log('userLocale', req.params, req.query)
  //   Users.findOneAndUpdate({
  //          _id: '5c59ed1e9148306b65d5a1a3'
  //         }, {
  //          session: req.query.locale
  //         }, {
  //          upsert: true,
  //          new   : true
  //         })
  //     .exec( (err, logged) => {
  //       if(err) throw err; 
  //   });
  // };

};

module.exports = ClickHandler;

/*
	this.whosGoing = function(req, res) {
		
		Users.find({}).select({"nightlife": 1})
        	.exec(function(err, user){
            	if(err) return console.error(err);
            	console.log(user)
        	})
	};
	
	//get.getNightlife
	// this.getNightlife = function(req, res) {
	// 	Users.find({'_id': '5b0ec12c97f0f00904855412' })
	// 		.exec(function(err, user) {
	// 			if(err) return console.error(err);
	// 			console.log(user)
	// 		})
	// };
*/