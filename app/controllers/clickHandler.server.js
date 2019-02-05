'use strict';

var Users = require('../models/users.js');
var yelp = require('yelp-fusion');

function ClickHandler () {
	
	this.getClicks = function (req, res) {
		//console.log(req.query)
		Users
			.findOne({ 'twitter.id': req.user.twitter.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		//console.log(req.body.logBars)
		Users
			.find({})//.select({'_id' : '5b0ffcbb2f55ef0bf9c5398a'})
			.exec(function (err, result) {
					if (err) throw err; 
				//'twitter.id': req.user.twitter.id	
				console.log(result)
				//	res.json(result.nbrClicks);
				}
			);
	};
	
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
	
	// queries the Yelp api and stores session data and location
	this.getNightlife = function(req, res) {
		console.log('this.getnightlife',req.user, req.params, req.query)
		 var Client = yelp.client(process.env.API_KEY);
     var searchRequest = {
        		term    : 'bars',
    	    	location: req.query.location,
            sort_by : 'rating',
            limit   : 20,
        	};
     
     if(!req.user) {
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
            _id : req.user._id
            }, {
            previousSession : req.query.location
            }, {
            new   : true, 
            upsert: true
            })
          	.exec(function(err, success){
             	if(err) return console.error(err);
              console.log('users or', success)
        	  });    
     };
        
      // Yelp api	
     Client.search(searchRequest).then(response => {
       var results = response.jsonBody.businesses,
           json    = JSON.stringify(results, null, 4);
        	// saves and updates <var results> to db
        //console.log(results)
        	// Users.findOneAndUpdate({ '_id':'5b0ffba56dd7f80bbd6a953b' }, { 'twitter.cache' : results })
        	// 	   .exec(function(err) {
        	// 		   if(err) return console.error(err);
        	// 	   });

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
      console.log(user[0].twitter)
				res.json(user[0].twitter);
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