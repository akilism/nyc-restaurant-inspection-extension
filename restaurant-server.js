/**
 * Created by akil.harris on 10/25/13.
 */

var express = require('express');
var url = require('url');
var NA = require("nodealytics");
var mongoConnect = require('./lib/mongo_dal');
var server = express.createServer();



/**********************
 **      ROUTES      **
 **********************/
server.get('/getRestaurantGrade', function (request, response) {
    var _get = url.parse(request.url, true);
    var query = _get.query;
    console.log('getRestaurantGrade for ' + query.name);

    var restaurantData = {
        name        : (query.name) ? query.name : '',
        zip_code    : (query.zip_code) ? parseInt(query.zip_code) : 0,
        street_name : (query.street_name) ? query.street_name : '',
        building    : (query.building) ? query.building : '',
        telephone   : (query.telephone) ? query.telephone : '',
        URL         : (request.headers.referer) ? request.headers.referer : 'no-referer'
    };


    NA.initialize('UA-45253887-1', 'mynameismyname.com', function () {
        NA.trackPage((request.headers.referer) ? request.headers.referer : 'no-referer', 'Search for ' + query.name, function (err, resp) {
            if (!err, resp.statusCode === 200) {
                console.log("tracked.")
            }
        });
    });

    mongoConnect.fetchRestaurant(restaurantData, function (responseBody) {
        response.send(buildResponse(responseBody));
    });

});

var buildResponse = function(results) {
    if(results !== -1) {

        var responseData = {
            grade_image          : results.grade_image,
            last_inspection_date : results.last_inspected_date,
            current_grade        : results.current_grade,
            score_violations     : results.score_violations
        };

        return responseData;
    }

    return { error: -1 };
};

var port = process.env.PORT || 8088;
server.listen(port);
console.log('Listening on port ' + port + '.');
