/**
 * Created by akil.harris on 10/25/13.
 */

var express = require('express');
var url = require('url');
var NA = require("nodealytics");
var mongoConnect = require('./lib/mongo_dal');
var server = express.createServer();
var restaurantData;
var request_url;

/**********************
 **      ROUTES      **
 **********************/
server.get('/getRestaurantGrade', function (request, response) {
    var _get = url.parse(request.url, true);
    var query = _get.query;
    request_url = request.url;
    console.log('getRestaurantGrade for ' + query.name);

    restaurantData = {
        name        : (query.name) ? query.name : '',
        zip_code    : (query.zip_code) ? parseInt(query.zip_code) : 0,
        street_name : (query.street_name) ? query.street_name : '',
        building    : (query.building) ? query.building : '',
        telephone   : (query.telephone) ? query.telephone : '',
        URL         : (request.headers.referer) ? request.headers.referer : 'no-referer'
    };

    mongoConnect.fetchRestaurant(restaurantData, function (responseBody) {
        response.send(buildResponse(responseBody));
    });

});

var buildResponse = function(results) {

    var matched = (results === -1) ? false : true;

    NA.initialize('UA-45253887-1', 'mynameismyname.com', function () {
        NA.trackEvent('Search from: ' + restaurantData.URL, request_url, 'Match', matched, function (err, resp) {
//            if (!err, resp.statusCode === 200) {
//
//            }
        });
        NA.trackPage('Search for :' + restaurantData.name, restaurantData.name.replace(" ", "-") + '?match=' + matched, function (err, resp) {
            //            if (!err, resp.statusCode === 200) {
            //
            //            }
        });
    });

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
