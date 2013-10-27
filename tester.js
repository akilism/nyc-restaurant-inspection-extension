/**
 * Created by akil.harris on 8/22/13.
 * TODO refactor this into its own parsing class and out of this testing file.
 * TODO write code to interface with mongoDB collections.
 **/

connections = require('./lib/restaurantConnections');
parser = require('./lib/restaurantParser');
mongoConnect = require('./lib/mongo_dal');

var restaurantData = {
    total_count: 0,
    total_batches: 0,
    batch_size: 500,
    current_batch: 0,
    last_completed_batch: 0,
    retry_limit: 10,
    current_retry_count: 0,
    restaurants: Array(),
    inspections: Array(),
    neighborhoods: Array(),
    setBatchSize: function (batch_size) {
        this.batch_size = batch_size;
    },
    calculateTotalBatches: function() {
        this.total_batches = Math.ceil(this.total_count / this.batch_size);
    },
    setTotalCount: function(count) {
        this.total_count = count;
        console.log('total_count      : ' + count);
    },
    setInspections: function(inspections) {
        this.inspections = inspections;
    },
    setRestaurants: function(restaurants) {
        this.restaurants = restaurants;
    },
    setNeighborhoods: function(neighborhoods) {
        this.neighborhoods = neighborhoods;
    },
    getCurrentBatch: function () {
        return this.current_batch;
    },
    getBatchSize: function () {
        console.log("batch_size * current_batch     : " + this.batch_size * this.current_batch);
        console.log("total_count                    : " + this.total_count);
        if ((this.batch_size * this.current_batch) + this.batch_size > this.total_count) {
            console.log("(batch_size * current_batch) - total_count                    : " + (this.total_count - (this.batch_size * this.current_batch)));
            return this.total_count - (this.batch_size * this.current_batch);
        }
        return this.batch_size;
    },
    getTotalCount: function () {
        return this.total_count;
    },
    incrementBatch: function() {
        this.current_batch++;
    },
    incrementLastCompletedBatch: function() {
        this.last_completed_batch++;
    },
    retriesLeft: function() {
        return (this.current_retry_count <= this.retry_limit) ? true : false;
    }
};

var inspectionCallback = function(error, response, body) {
    if(response.statusCode === 200) {
        restaurantData.setInspections(parser.parseInspectionForRestaurant(body));
    } else {
        console.log('response.statusCode: ' + response.statusCode + ' error: ' + error);
    }
};

var restaurantListCallback = function(error, response, body) {
    if(response.statusCode == 200) {
        restaurantData.setRestaurants(parser.parseRestaurantBatch(body));
        insertRestaurants(restaurantData.restaurants);
        restaurantData.incrementBatch();
        restaurantData.incrementLastCompletedBatch();
        getAllRestaurants(restaurantData.getCurrentBatch());
    } else {
        console.log('response.statusCode: ' + response.statusCode + ' error: ' + error);
    }
};

var totalCallback = function (error, response, body) {
    if(response.statusCode === 200) {
        restaurantData.setTotalCount(parser.parseTotalResponse(body));
        restaurantData.calculateTotalBatches();
    } else {
        console.log("error: " + error);
    }
};

var neighborhoodCallback = function (error, response, body) {
    if(response.statusCode === 200) {
        restaurantData.setNeighborhoods(parser.parseNeighborhoodResponse(body));
    } else {
        console.log("error: " + error);
    }
    insertNeighborhoods(restaurantData.neighborhoods);
};

var additionalBatches = function() {
    return (restaurantData.current_batch === restaurantData.total_batches) ? false : true;
};

var fetchBatches = function () {

    if(!additionalBatches) { return; }

    connections.getRestaurantBatch(restaurantData.getCurrentBatch(), restaurantData.getBatchSize(), restaurantListCallback);
    restaurantData.incrementBatch();
};

var insertNeighborhoods = function(neighborhoods) {
    mongoConnect.add_neighborhoods(neighborhoods);
};

var insertRestaurants = function(restaurants) {
    mongoConnect.add_restaurants(restaurants);
}

var getAllRestaurants = function(current_batch)  {

    if (current_batch === 0) {
        connections.getTotalCount(function (error, response, body) {
            totalCallback(error, response, body);
            connections.getRestaurantBatch(restaurantData.getCurrentBatch(), restaurantData.getBatchSize(), restaurantListCallback);
        });
    } else if (current_batch < restaurantData.total_batches) {
        connections.getRestaurantBatch(restaurantData.getCurrentBatch(), restaurantData.getBatchSize(), restaurantListCallback);
    } else {
        console.log("All restaurants added.");
    }
};

getAllRestaurants(restaurantData.getCurrentBatch());

//connections.getTotalCount(function (error, response, body) { totalCallback(error, response, body); });
//connections.getRestaurantBatch(restaurantData.getCurrentBatch(), restaurantData.getBatchSize(), restaurantListCallback);



//connections.getNeighborhoods(neighborhoodCallback);
