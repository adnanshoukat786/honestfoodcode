const express = require('express');
const os = require('os');
var NodeGeocoder = require('node-geocoder');
fs = require('fs');

var turf = require("@turf/turf")


var parser = require('xml2json');

var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: '', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

const app = express();

app.use(express.static('dist'));
app.get('/api/getresult', (req, res) => {
	fs.readFile( './public/data/outlet.xml', function(err, data) {
		//console.log(data);
		//console.log(err);
    	var json = JSON.parse(parser.toJson(data));
    	points = [];
    	var name = '';
    	//res.send(json.kml.Document)
		 geocoder.geocode(req.query.address, function(err, resp) {
			res.send(Placemark(json, resp));
		});

	});
	/*geocoder.geocode(req.query.address, function(err, resp) {
 	 	res.send(resp[0]);
 	 	console.log(resp[0].latitude);
 	 	console.log(resp[0].longitude);
 	 	//console.log(err);
	});*/

});

function Placemark(json , resp){
	for (let marks of json.kml.Document.Placemark) {
  			if(typeof marks.Polygon !== 'undefined'){
	  				Polygon = marks.Polygon.outerBoundaryIs.LinearRing.coordinates.split("\n")
	  				var poly = [];
	  				Polygon.forEach(function(coordinate){
	  						LatLng = coordinate.split(",",2);
	  						poly.push([parseFloat(LatLng[0].trim()) , parseFloat(LatLng[1].trim())]);
	  						
	  				});

	  				var pt = turf.point([resp[0].longitude,resp[0].latitude]);
					var poly = turf.polygon([poly]);
					
					if(turf.booleanPointInPolygon(pt, poly) == true){
						//console.log(marks.name);
						return marks.name
						break;
					}
	  			}

		}
		return 'No Data';


		//var name = json.kml.Document.Placemark.forEach(function (marks , idx) {
	  			
			//});

		//console.log(name);
	}
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
