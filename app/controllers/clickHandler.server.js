'use strict';

var Users = require('../models/users.js');
var yelp = require('yelp-fusion');

function ClickHandler () {
  // resets RSVP's after 6am;
  const resetRSVP = () => {
    if(new Date().getHours() === 6) {
      Users
        .find({}).select({ 'twitter.nightlife': 1, _id: false})
        .exec((err, results) => {
          if (err) throw err; 
      
          results.forEach( (array, idx) => {
            let arr = array.twitter.nightlife;
            if(arr.length > 0) {       
              for(var i = 0; i < arr.length; i++) {
                let item = arr[i];
                if(item.count > 0) {
                  item.count = 0;
                }; 
              }; 
            };        
          }); // forEach()
        
        results.save();
      }); 
    };  
  };
	
  // interval checks time once an hour
  //setInterval(resetRSVP, 3600000);
  
	this.getClicks = (req, res) => {
    let nightlife = [];
		
    Users
			.find({}).select({ 'twitter.nightlife': 1, _id: false})
			.exec((err, results) => {
				if (err) throw err;
        let demoObj = {
          twitter: {
            nightlife: [
            {
                "id": "6NzbgOQx1onp0q526O55qg",
                "name": "OAK Bistro & Wine Bar",
                "count": 1
            },
            {
                "id": "KBObkCcWPvck1n9ShB5DWg",
                "name": "Due South Brewing",
                "count": 1
            },
            {
                "id": "8LRYOrf-ZRQJjmh929VzIg",
                "name": "The Venu Restaurant and Bar",
                "count": 1
            },
            {
                "id": "QOO0LIBqftW8AYQsbF9Q3g",
                "name": "McKenna's Place",
                "count": 1
            },
            {
                "id": "HK_VnPpIzEFZ0iT1xVbx-A",
                "name": "Iberia Bar & Grill",
                "count": 1
            },
            {
                "id": "K1JzjCE0JnhZ0ahwwS6MZQ",
                "name": "The Chill Room",
                "count": 1
            },
            {
                "id": "bWhgHY7At3T5obS3pORYHw",
                "name": "JoJo's Raw Bar & Grill",
                "count": 1
            },
            {
                "id": "0rzaXNCJ_cT9oz6NQjC4rQ",
                "name": "Ali Baba Cafe & Hookah Lounge",
                "count": 1
            }, {
                "id": "B9cbm_4R_H1Bdv-L6K3gDQ",
                "name": "The Brass Tap",
                "count": 1
            }, {
                "id": "ODEyQsSNl26ud1icQy-akQ",
                "name": "Eagle Grill",
                "count": 1
            }, {
                "id": "vt-PoDTSRjUENvUGArxKsw",
                "name": "Ford's Garage Wellington",
                "count": 1
            }, {
                "id": "cLQwj3WilmobrjH9wLvQOw",
                "name": "The Beauty and The Beeeef",
                "count": 1
            }, {
                "id": "uDLElE2G5YpQzEGzkJ9tpg",
                "name": "Bar Louie",
                "count": 1
            }, {
                "id": "we-nPde5Mws1-pp8YbV2Hw",
                "name": "Asador Patagonia",
                "count": 1
            }, {
                "id": "RGs0qo2CPGh15-CZ6HC9BA",
                "name": "Bonefish Mac's Sports Grille",
                "count": 1
            }, {
                "id": "WCaWUMhiKqsc4qtBSThEUw",
                "name": "Brass Monkey Tavern",
                "count": 1
            }, {
                "id": "52QujdUomOzpW9zgK14gkQ",
                "name": "Elmo's Rock Bar & Grill",
                "count": 1
            }
        ]
          }  
        };
        console.log('results', results)
        results.forEach((array, idx) => {
          let arr = array.twitter.nightlife;
          if(arr.length > 0) {       
            for(var i = 0; i < arr.length; i++) {
              let item = arr[i];
              //console.log('item', item)
             
              if(item.count > 0) {
                nightlife.push(item.id);
              } 
            } 
          }        
        });
     
		res.json(nightlife);
		}); 
  }; // getClicks

	this.addClick = (req, res) => {
		Users
			.findOne({'twitter.id': req.body.userId})
      .select({'twitter.nightlife': 1})
			.exec((err, result) => {
					if (err) throw err; 
          let barCount = {}        
          
          if(result) {
            let nightlife = result.twitter.nightlife;
            let found = 1;
            for(var i = 0; i < nightlife.length; i++) {
               if(nightlife[i].id === req.body.id ) {
                 barCount.id = nightlife[i].id;
                 nightlife[i].count === 1 ? nightlife[i].count = 0 
                                          : nightlife[i].count = 1;
                 
                 barCount.count = nightlife[i].count;
                 found = 0;
               }
            };                      
            
            if(found) {
              let obj = { 
                id    : req.body.id,
                name  : req.body.name,
                count : 1
                };
              result.twitter.nightlife.push(obj);
              barCount = { id : req.body.id, count: 1};
            }
            
            result.save(err => {
              if(err) throw err;
            });            
            
            res.json(barCount);
         };

			});
	};
	
	// queries the Yelp api and stores session data and location
	this.getNightlife = (req, res) => {
		 var Client = yelp.client(process.env.API_KEY);
     var request = {
        		term    : 'bars',
    	    	location: req.query.location,
            sort_by : 'rating',
            limit   : 20,
        	};
     
     //if user authenticates, save location to user
     if(req.body.user) { 
       Users.findOneAndUpdate({ 
            'twitter.id' : req.body.user
            }, {
            'twitter.previousSession' : req.query.location
            }, {
            new   : true, 
            upsert: true
            })
          	.exec((err, success) => {
             	if(err) return console.error(err);
        	  });    
     };
        
      // Yelp Fusion api	
     Client.search(request).then(response => {
       var results = response.jsonBody.businesses,
           json    = JSON.stringify(results, null, 4);
           
           return res.json(json);
     }).catch(error => {
       	return res.json(error);
    }); 
	};
	
	// returns the user location and cached search results after twitter log in
	this.userLocation = (req, res) => {
   
		Users.find({_id: req.user._id})
			.exec((err, user) => {
				if(err) throw err;       
       
        return res.json(user[0]);     				
			});
	}; 

};

module.exports = ClickHandler;

/*
     //if user authenticates save location to user
     if(!req.session.passport) { //req.body.user
       console.log('updated locale session')
       Users.findOneAndUpdate({
             'session.location' : /\w*(/)
            }, {
             'session.location' : req.query.location
            }, {
             upsert: true,
             new   : true
            })
            .exec( (err, logged) => {
              if(err) throw err; 
            });
     } else {
       console.log('updated user session')
       Users.findOneAndUpdate({ 
            '_id' : req.session.passport['user'] //req.body.user
            }, {
            'twitter.previousSession' : req.query.location
            }, {
            new   : true, 
            upsert: true
            })
          	.exec((err, success) => {
             	if(err) return console.error(err);
              console.log('success', success)
        	  });    
     };
*/