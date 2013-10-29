/**
 * Created by akil.harris on 10/25/13.
 */

var express = require('express');
var url = require('url');
var mongoConnect = require('./lib/mongo_dal');
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

    mongoConnect.fetchRestaurant(restaurantData, function (responseBody) {
        console.log(responseBody);
        response.send(buildResponse(responseBody));
    });

});

var buildResponse = function(results) {

    if(results !== -1) {

        var responseData = {
            grade_image: results.grade_image,
            last_inspection_date: results.last_inspected_date,
            current_grade: results.current_grade,
            score_violations: results.score_violations
        };

        return responseData;
    }

    return results;
};

var port = process.env.PORT || 8088;
server.listen(port);
console.log('Listening on port ' + port + '.');
