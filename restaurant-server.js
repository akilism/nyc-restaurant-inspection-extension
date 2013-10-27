/**
 * Created by akil.harris on 10/25/13.
 */

var express = require('express');
var url = require('url');
var mongoConnect = require('./static/js/mongo_dal');
var server = express.createServer();



/**********************
 **      ROUTES      **
 **********************/
//http://localhost:8088/getRestaurantGrade?name=Bon%20Spice%20Cafe&zip_code=11237&stree_name=St.%20Nicholas%20Avenue&building=140
server.get('/getRestaurantGrade', function (request, response) {
    var _get = url.parse(request.url, true);
    var query = _get.query;

    console.log('getRestaurantGrade for ' + query.name);

    var restaurantData = {
        name: (query.name) ? query.name : '',
        zip_code: (query.zip_code) ? parseInt(query.zip_code) : 0,
        street_name: (query.street_name) ? query.street_name : '',
        building: (query.building) ? query.building : '',
        telephone: (query.telephone) ? query.telephone : ''
    };

    var response_body = fetchRestaurant(restaurantData);
    response.send(buildResponse(response_body));
});

var fetchRestaurant = function (restaurantData) {

    console.log('Trying name and address search.');
    mongoConnect.findRestaurantByNameAndAddress(restaurantData, function (err, results) {
        if (err) { console.warn(err); }

        if (!results) {

            if (restaurantData.telephone !== '') {

                console.log('No match for ' + restaurantData.name + ' trying name and telephone search.');
                mongoConnect.findRestaurantByNameAndTelephone(restaurantData, function (err, results) {
                    if (err) { console.warn(err); return; }

                    if (results) {
                        console.log('Results for ' + results.name);
                        console.log(results);

                        return results;
                    } else {
                        console.log('No match for ' + restaurantData.name + ' trying address search.');
                        mongoConnect.findRestaurantByAddress(restaurantData, function (err, results) {
                            if (err) { console.warn(err); return; }

                            if (results) {
                                console.log('Results for ' + results.name);
                                console.log(results);

                                return results;
                            } else {
                                console.log('No Match for : ' + restaurantData.name);
                                return -1;
                            }
                        });
                    }
                });

            } else {

                console.log('No match for ' + restaurantData.name + ' trying address search.');
                mongoConnect.findRestaurantByAddress(restaurantData, function (err, results) {
                    if (err) { console.warn(err); return; }

                    if (results) {
                        console.log('Results for ' + results.name);
                        console.log(results);

                        return results;
                    } else {
                        console.log('No Match for : ' + restaurantData.name);
                        return -1;
                    }
                });

            }
        } else {
            console.log('Results for ' + results.name);
            console.log(results);

            return results;
        }
    });
}

var buildResponse = function(results) {

    if(results !== -1) {

        var responseData = {
            grade_image: results.grade_image,
            last_inspection_date: results.last_inspected_date
        };

        return responseData;
    }

    return results;
};

var port = process.env.PORT || 8088;
server.listen(port);
console.log('Listening on port ' + port + '.');
