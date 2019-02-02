'use strict';

var Users = require('../models/users.js');
var yelp = require('yelp-fusion');

function ClickHandler () {
	
	this.getClicks = function (req, res) {
		console.log(req.query)
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
	this.getNightlife = function(req, res) {
		Users.find({'_id': '5b0ec12c97f0f00904855412' })
			.exec(function(err, user) {
				if(err) return console.error(err);
				console.log(user)
			})
	};
	
	// queries the Yelp api and stores session data and location
	this.getNightlife = function(req, res) {
			
		var Client = yelp.client(process.env.API_KEY);
    	var searchRequest = {
        		term:'bars',
    	    	location: req.query.location,
            	sort_by: 'rating',
            	limit: 20,
        	};
        	
        //Users.find({}).select({'nightlife': 1})	
        	
     	// saves and updates <req.query.location> to db
        Users.findOneAndUpdate({ '_id' : '5b0ffcbb2f55ef0bf9c5398a' }, { 'twitter.location': req.query.location })
        	.exec(function(err){
            	if(err) return console.error(err);
        	}) //, {'returnOriginal': false}) // code only works for user.save()
        
        // Yelp api	
    	Client.search(searchRequest).then(response => {
        	var results = response.jsonBody.businesses,
            	json = JSON.stringify(results, null, 4);
        	// saves and updates <var results> to db
        	Users.findOneAndUpdate({ '_id':'5b0ffba56dd7f80bbd6a953b' }, { 'nightlife.cache' : results })
        		.exec(function(err) {
        			if(err) return console.error(err);
        		});

            res.json(json);
    	}).catch(error => {
        	res.end("We apologize, there has been an error processing your request. Error message: " + error);
    	}); 
	};
	
	// returns the user location and cached search results after twitter log ingit
	this.userLocation = function(req, res) {
		Users.find({ '_id' : { $in: [
						'5b0ffba56dd7f80bbd6a953b',
						'5b0ffcbb2f55ef0bf9c5398a'
						]}
					})
			.exec(function(err, user){
				if(err) throw err;
				res.json(user);
			});
	};

}

module.exports = ClickHandler;