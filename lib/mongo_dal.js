/**
 * Created by akilharris on 8/27/13.
 * Mongo Console
 * mongo paulo.mongohq.com:10047/app18950121 -u <user> -p<password>
 * Mongo URI
 * mongodb://<user>:<password>@paulo.mongohq.com:10047/app18950121
 */

var mongoConnect = function () {

    var dbInfo = {
      host        : '192.168.1.14',
      port        : 27017,
      db_name     : 'nyc_restaurant_inspections',
      collections : {
        restaurant   : 'restaurants',
        inspection   : 'inspections',
        neighborhood : 'neighborhoods',
        url          : 'siteURLS'
      },
      mongoURL    : function () {
          return process.env.MONGOHQ_URL || "mongodb://" + this.host + ":" + this.port + "/" + this.db_name
      },
      MongoClient : require('mongodb').MongoClient,
      Server      : require('mongodb').Server // function ()  { return new this.mongodb.Server(this.host, this.port, {});
    };

    var insert_restaurants = function(restaurants) {

        console.log("restaurants.length             : " + restaurants.length);
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {    
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);

            collection.insert(restaurants, {w: 1, safe: true}, function (err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('successfully updated restaurants.');
                    db.close();
                }
            });
        });
    };

    var upsert_restaurant = function(restaurantData) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);

            collection.update({camis: restaurantData.camis}, {$set: {
                camis: restaurantData.camis,
                name: restaurantData.name,
                search_name: restaurantData.search_name,
                cuisine_type: restaurantData.cuisine_type,
                current_grade: restaurantData.current_grade,
                grade_image: restaurantData.grade_image,
                last_inspected_date: restaurantData.last_inspected_date,
                last_inspection_data: restaurantData.last_inspection_date,
                program: restaurantData.program,
                golden_apple: restaurantData.golden_apple,
                violations_group: restaurantData.violations_group,
                telephone: restaurantData.telephone,
                address: restaurantData.address,
                geo_data: restaurantData.geo_data,
                GeoJSON: restaurantData.GeoJSON
            }}, {safe: true, upset:true}, function(err) {
                if (err) {
                    console.warn(err.message);
                } else {
                    console.log('successfully updated - restaurant     : ' + restaurantData.name);
                    db.close();
                }

            });
        });
    };

    var insert_neighborhoods = function(neighborhoods) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.neighborhood);

            collection.insert(neighborhoods, {w: 1}, function (err, result) {
                if (err) {
                        console.log(err.message);
                    } else {
                        console.log('successfully updated neighborhoods.');
                        db.close();
                    }
            });
        });
    };

    var upsert_neighborhood = function(neighborhood) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.neighborhood);

            collection.update({neighborhood_name: neighborhood.neighborhood_name}, {$set: {
                neighborhood_name: neighborhood.neighborhood_name,
                zip_codes: neighborhood.zip_codes
            }}, {upset:true}, function(err) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('successfully updated - neighborhood     : ' + neighborhood.neighborhood_name);
                    db.close();
                }
            });
        });
    };

    var insert_inspections = function(inspections) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.inspection);

            collection.insert(inspections, {w: 1}, function (err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('successfully updated neighborhoods.');
                    db.close();
                }
            });
        });
    };

    var upsert_inspection = function(inspectionData) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.inspection);

            collection.update({camis: inspectionData.camis}, {$set: {
                borough_code: inspectionData.borough_code,
                building: inspectionData.building,
                cuisine: inspectionData.cuisine,
                current_grade: inspectionData.current_grade,
                grade_image: inspectionData.grade_image,
                sort_order: inspectionData.sort_order,
                golden_apple: inspectionData.golden_apple,
                grade_date: inspectionData.grade_date,
                str_grade_date: inspectionData.str_grade_date,
                in_sync: inspectionData.in_sync,
                inspection_date: inspectionData.inspection_date,
                str_inspection_date: inspectionData.str_inspection_date,
                inspection_group: inspectionData.inspection_group,
                inspection_type: inspectionData.inspection_type,
                latest: inspectionData.latest,
                name: inspectionData.name,
                name_and_score: inspectionData.name_and_score,
                name_first_letter: inspectionData.name_first_letter,
                neighbor_code: inspectionData.neighbor_code,
                percent_rank: inspectionData.percent_rank,
                phone_number: inspectionData.phone_number,
                pre_adjudication: inspectionData.pre_adjudication,
                restaurant_geo_code: inspectionData.restaurant_geo_code,
                restaurant_inspection_pk: inspectionData.restaurant_inspection_pk,
                score: inspectionData.score,
                score_and_name: inspectionData.score_and_name,
                search_name: inspectionData.search_name,
                service_description: inspectionData.service_description,
                street: inspectionData.street,
                ttl_critical_violation: inspectionData.ttl_critical_violation,
                ttl_violation: inspectionData.ttl_violation,
                version: inspectionData.version,
                violation_group: inspectionData.violation_group,
                vps_suspended: inspectionData.vps_suspended,
                zip_code: inspectionData.zip_code,
                camis: inspectionData.camis,
                program: inspectionData.program
            }}, {safe: true, upset:true},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    } else {
                        console.log('successfully updated - inspection     : ' + inspectionData.camis);
                        db.close();
                    }
            });
        });
    };

    var nameSearch = function (restaurantData, callBack) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);

            collection.findOne({ name  : { $regex : '' + restaurantData.name + '', $options: 'i'} },
            function (err, doc) {
                if (err) {
                    console.warn(err.message);
                    db.close();
                    callBack(err, null);
                } else {
                    db.close();
                    callBack(null, doc);
                }
            });
        });
    };

    var addressSearch = function (restaurantData, callBack) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);
            console.log('Address Search: ');
            console.log('address.building      :' + restaurantData.building);
            console.log('address.street_name   :' + restaurantData.street_name.replace('.','').toUpperCase());
            console.log('address.zip_code      :' + restaurantData.zip_code);
            console.log('');

            collection.findOne({ 'address.building': restaurantData.building,
                             'address.street_name' : restaurantData.street_name.replace('.','').toUpperCase(),
                             'address.zip_code'    : restaurantData.zip_code },
            function (err, doc) {
                if (err) {
                    console.warn(err.message);
                    db.close();
                    callBack(err, null);
                } else {
                    db.close();
                    callBack(null, doc);
                }
            });
        });
    };

    var nameAndAddressSearch = function (restaurantData, callBack) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);

            console.log('Name and Address Search: ');
            console.log('name                  :' + restaurantData.name);
            console.log('address.building      :' + restaurantData.building);
            console.log('address.street_name   :' + restaurantData.street_name.toUpperCase());
            console.log('address.zip_code      :' + restaurantData.zip_code);
            console.log('');

            collection.findOne({ name  : { $regex : '' + restaurantData.name + '', $options: 'i'},
                                 'address.building'    : restaurantData.building,
                                 'address.street_name' : restaurantData.street_name.toUpperCase(),
                                 'address.zip_code'    : restaurantData.zip_code
                              },
                function (err, doc) {
                    if (err) {
                        console.warn(err.message);
                        db.close();
                        callBack(err, null);
                    } else {
                        db.close();
                        callBack(null, doc);
                    }
            });
        });
    };

    var nameAndTelephoneSearch = function (restaurantData, callBack) {
        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.restaurant);

            console.log('Name and Telephone Search: ');
            console.log('name                  :' + restaurantData.name);
            console.log('telephone             :' + restaurantData.telephone);
            console.log('');

            collection.findOne({ name  : { $regex : '' + restaurantData.name + '', $options: 'i'},
                                'telephone'            : restaurantData.telephone
                },
                function (err, doc) {
                    if (err) {
                        console.warn(err.message);
                        db.close();
                        callBack(err, null);
                    } else {
                        db.close();
                        callBack(null, doc);
                    }
                });
        });
    };

    var fetchRestaurant = function (restaurantData, callBack) {
        var result;

        console.log('Trying name and address search.');
        nameAndAddressSearch(restaurantData, function (err, results) {
            if (err) { console.warn(err); }

            if (!results) {

                if (restaurantData.telephone !== '') {

                    console.log('No match for ' + restaurantData.name + ' trying name and telephone search.');
                    nameAndTelephoneSearch(restaurantData, function (err, results) {
                        if (err) { console.warn(err); return; }

                        if (results) {
                            console.log('Results for ' + results.name);
                            console.log(results);

                            result = results;
                        } else {
                            console.log('No match for ' + restaurantData.name + ' trying address search.');
                            addressSearch(restaurantData, function (err, results) {
                                if (err) { console.warn(err); return; }

                                if (results) {
                                    console.log('Results for ' + results.name);
                                    console.log(results);

                                    result = results;
                                } else {
                                    console.log('No Match for : ' + restaurantData.name + ' trying name search.');
                                    nameSearch(restaurantData, function (err, results) {
                                        if (err) { console.warn(err); return; }

                                        if (results) {
                                            console.log('Results for ' + results.name);
                                            console.log(results);

                                            result = results;
                                        } else {
                                            console.log('No Match for : ' + restaurantData.name);
                                            result = -1;
                                        }
                                    });
                                }
                            });
                        }
                    });

                } else {

                    console.log('No match for ' + restaurantData.name + ' trying address search.');
                    addressSearch(restaurantData, function (err, results) {
                        if (err) { console.warn(err); return; }

                        if (results) {
                            console.log('Results for ' + results.name);
                            console.log(results);

                            result = results;
                        } else {
                            console.log('No Match for : ' + restaurantData.name + ' trying name search.');
                            nameSearch(restaurantData, function (err, results) {
                                if (err) { console.warn(err); return; }

                                if (results) {
                                    console.log('Results for ' + results.name);
                                    console.log(results);

                                    result = results;
                                } else {
                                    console.log('No Match for : ' + restaurantData.name);
                                    result = -1;
                                }
                            });
                        }
                    });

                }
            } else {
                console.log('Results for ' + results.name);
                console.log(results);

                result = results;
            }

            callBack(result);

            if(result !== -1) {
                logAndSaveURL(result, restaurantData.URL);
            }

        });
    }

    var logAndSaveURL = function (result, URL) {
        console.log('Saving     : ' + URL + ' for ' + result.name);

        /*
        *  Check to see if there is a url for the current restaurant for this site.
        *  if yes then if the url matches the saved url increment count. if count >= confirmed_count
        *  confirmed = true.
        *

        dbInfo.MongoClient.connect(dbInfo.mongoURL(), function(err, db) {
            if(err) { return console.dir(err); }

            var collection = db.collection(dbInfo.collections.url);

            collection.insert(restaurants, {w: 1, safe: true}, function (err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('successfully updated restaurants.');
                    db.close();
                }
            });
        });
        */
    };

    return {
        add_restaurant: function(data) {
            upsert_restaurant(data);
        },
        add_neighborhood: function(data) {
            upsert_neighborhood(data);
        },
        add_inspection: function(data) {
            upsert_inspection(data);
        },
        add_neighborhoods: function(data) {
            insert_neighborhoods(data);
        },
        add_restaurants: function(data) {
            insert_restaurants(data);
        },
        add_inspections: function(data) {
            insert_inspections(data);
        },
        findRestaurantByNameAndAddress: function (data, callBack) {
            return nameAndAddressSearch(data, callBack);
        },
        findRestaurantByName: function (data, callBack) {
            return nameSearch(data, callBack);
        },
        findRestaurantByAddress: function (data, callBack) {
            return addressSearch(data, callBack);
        },
        findRestaurantByNameAndTelephone: function (data, callBack) {
            return nameAndTelephoneSearch(data, callBack);
        },
        fetchRestaurant: function (data, callBack) {
            fetchRestaurant(data, function(result) {
                callBack(result);
            });
        }
    }
}();

module.exports = mongoConnect;