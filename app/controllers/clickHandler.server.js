/*
'use strict';

var Users = require('../models/users.js');
var yelp = require('yelp-fusion');

function ClickHandler () {
  // resets RSVP's after 6am;
  this.resetRSVP = (req, res) => {
    if(new Date().getHours() === 6) {
      Users.updateMany({},
        { $pull: 
          {'twitter.nightlife': {} }
        })
        .exec(err => {
          if (err) throw err;           
      }); 
    }
  };
  
  // return all rsvps for users
	this.getClicks = (req, res) => {
    let nightlife = [];
    // check if id exists in nightlife array
    function findId(id) {
      for(let i = 0; i < nightlife.length; i++) {
        if(nightlife[i].id === id) return i;
      }   
      return false;
    };  
	
    Users
		  .find({}).select({ 'twitter.nightlife': 1})
			.exec((err, results) => {
				if (err) throw err;
        
        // return restaurant id and total 'going' count for all users
        results.forEach((array, idx) => {
          let arr = array.twitter.nightlife;
        
          if(arr.length) {
            for(let i = 0; i < arr.length; i++) {           
              let item = arr[i];
              if(item.count) {
                let index = nightlife.length ? findId(item.id) : false;
                if(index !== false) {
                   nightlife[index].count += item.count;
                } else {
                   nightlife.push({
                     'id'    : item.id,
                     'count' : item.count
                   }); 
                }
              }
            }
          }
        });

		res.json(nightlife);
		}); 
  }; // getClicks

  // for authenticated users to add or remove rsvp  
	this.addClick = (req, res) => {
    
		Users
			.findOne({'twitter.id': req.body.userId})
      .select({'twitter.nightlife': 1})
			.exec((err, result) => {
					if (err) throw err;      
      
          if(result) {
            let nightlife = result.twitter.nightlife,
                barCount = {},
                barExists = false;
            for(var i = 0; i < nightlife.length; i++) {
                     
               if(nightlife[i].id === req.body.id ) {
                 nightlife[i].count = nightlife[i].count === 1 ? 0 : 1;
                 barCount.id        = nightlife[i].id;                
                 barCount.count     = nightlife[i].count === 0 ? -1 : 1;
                 barExists          = true;
               }
            };                      
            
            if(!barExists) {
              let obj = { 
                id    : req.body.id,
                name  : req.body.name,
                count : 1
              };
              
              // return obj to db and send barCount to UI
              result.twitter.nightlife.push(obj); 
              barCount = { 
                id    : req.body.id, 
                count : 1
              };
            }
            
            result.save( err => {
              if(err) throw err;
              res.json(barCount);
            });            
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
*/
/*
         // demo obj to populate 'going' data for zip code 33467     
        let demoObj = { twitter: {
            nightlife: [
            {
                "id": "6NzbgOQx1onp0q526O55qg",
                "name": "OAK Bistro & Wine Bar",
                "count": 14
            }, {
                "id": "KBObkCcWPvck1n9ShB5DWg",
                "name": "Due South Brewing",
                "count": 8
            }, {
                "id": "8LRYOrf-ZRQJjmh929VzIg",
                "name": "The Venu Restaurant and Bar",
                "count": 21
            }, {
                "id": "QOO0LIBqftW8AYQsbF9Q3g",
                "name": "McKenna's Place",
                "count": 11
            }, {
                "id": "HK_VnPpIzEFZ0iT1xVbx-A",
                "name": "Iberia Bar & Grill",
                "count": 16
            }, {
                "id": "K1JzjCE0JnhZ0ahwwS6MZQ",
                "name": "The Chill Room",
                "count": 5
            }, {
                "id": "bWhgHY7At3T5obS3pORYHw",
                "name": "JoJo's Raw Bar & Grill",
                "count": 10
            }, {
                "id": "0rzaXNCJ_cT9oz6NQjC4rQ",
                "name": "Ali Baba Cafe & Hookah Lounge",
                "count": 18
            }, {
                "id": "B9cbm_4R_H1Bdv-L6K3gDQ",
                "name": "The Brass Tap",
                "count": 26
            }, {
                "id": "ODEyQsSNl26ud1icQy-akQ",
                "name": "Eagle Grill",
                "count": 3
            }, {
                "id": "vt-PoDTSRjUENvUGArxKsw",
                "name": "Ford's Garage Wellington",
                "count": 20
            }, {
                "id": "cLQwj3WilmobrjH9wLvQOw",
                "name": "The Beauty and The Beeeef",
                "count": 12
            }, {
                "id": "uDLElE2G5YpQzEGzkJ9tpg",
                "name": "Bar Louie",
                "count": 18
            }, {
                "id": "we-nPde5Mws1-pp8YbV2Hw",
                "name": "Asador Patagonia",
                "count": 38
            }, {
                "id": "RGs0qo2CPGh15-CZ6HC9BA",
                "name": "Bonefish Mac's Sports Grille",
                "count": 44
            }, {
                "id": "WCaWUMhiKqsc4qtBSThEUw",
                "name": "Brass Monkey Tavern",
                "count": 55
            }, {
                "id": "52QujdUomOzpW9zgK14gkQ",
                "name": "Elmo's Rock Bar & Grill",
                "count": 36
            }, {
                "id": "w_TILSpebOiv2Ma46oLX_w",
                "name": "Copperpoint Brewing Co",
                "count": 48
            }, {
                "id": "6Kw1Rlx44zXsLfBItumCGw",
                "name": "Kaluz Restaurant",
                "count": 52
            }, {
                "id": "l5rYrJlWnvqjV-lY2F2-WQ",
                "name": "Flanigan's Seafood Bar & Grill",
                "count": 61
            }]
          }  
        };
        results.push(demoObj);
      */
var Users=require("../models/users.js"),yelp=require("yelp-fusion");
function ClickHandler(){this.resetRSVP=function(a,d){6===(new Date).getHours()&&Users.updateMany({},{$pull:{"twitter.nightlife":{}}}).exec(function(b){if(b)throw b;})};this.getClicks=function(a,d){var b=[];Users.find({}).select({"twitter.nightlife":1}).exec(function(a,f){if(a)throw a;f.forEach(function(a,f){var e=a.twitter.nightlife;if(e.length)for(var d=0;d<e.length;d++){var c=e[d];if(c.count){var g;if(b.length)a:{for(g=0;g<b.length;g++)if(b[g].id===c.id)break a;g=!1}else g=!1;!1!==g?b[g].count+=
c.count:b.push({id:c.id,count:c.count})}}});d.json(b)})};this.addClick=function(a,d){Users.findOne({"twitter.id":a.body.userId}).select({"twitter.nightlife":1}).exec(function(b,c){if(b)throw b;if(c){for(var f=c.twitter.nightlife,h={},k=!1,e=0;e<f.length;e++)f[e].id===a.body.id&&(f[e].count=1===f[e].count?0:1,h.id=f[e].id,h.count=0===f[e].count?-1:1,k=!0);k||(c.twitter.nightlife.push({id:a.body.id,name:a.body.name,count:1}),h={id:a.body.id,count:1});c.save(function(a){if(a)throw a;d.json(h)})}})};
this.getNightlife=function(a,d){var b=yelp.client(process.env.API_KEY),c={term:"bars",location:a.query.location,sort_by:"rating",limit:20};a.body.user&&Users.findOneAndUpdate({"twitter.id":a.body.user},{"twitter.previousSession":a.query.location},{"new":!0,upsert:!0}).exec(function(a,b){if(a)return console.error(a)});b.search(c).then(function(a){a=JSON.stringify(a.jsonBody.businesses,null,4);return d.json(a)})["catch"](function(a){return d.json(a)})};this.userLocation=function(a,d){Users.find({_id:a.user._id}).exec(function(a,
c){if(a)throw a;return d.json(c[0])})}}module.exports=ClickHandler;