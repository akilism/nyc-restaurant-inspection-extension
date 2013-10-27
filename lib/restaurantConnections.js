/*
 *
 * Created by akil.harris on 8/21/13.
 *
 */

var restaurantConnector = function () {

    var connector = {
        ajaxConnector: require('./ajaxConnector'),
        payloadToString: function (payload) {
            var name;
            var str_payload = '';

            for(name in payload) {
                if(typeof payload[name] !== 'function')
                {
                    str_payload += name + "=" + payload[name] + "\n";
                }
            }

            return str_payload;
        }
    };

    return {
        getRestaurantBatch : function (batch, batch_size, callback) {

            console.log("batch_size                     : " + batch_size);
            var url = 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/dwr/call/plaincall/RestaurantSpringService.getResultsSrchCriteria.dwr';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchResults.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}921',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getResultsSrchCriteria',
                'c0-id': 0,
                'c0-param0': 'boroughCode%20%3A_3_1_4_5_2',
                'c0-param1': 'displayOrder',
                'c0-param2': true,
                'c0-param3': batch,
                'c0-param4': batch_size,
                batchId: 1
            };
            connector.ajaxConnector.setConnectionWithRetry(url, connector.payloadToString(payload), callback, 5);
            connector.ajaxConnector.connect();
        },
        getTotalCount : function (callback_function) {
            var url = 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/dwr/call/plaincall/RestaurantSpringService.getTotalCountCriteria.dwr';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchBrowse.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}686',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getTotalCountCriteria',
                'c0-id': 0,
                'c0-param0': 'string:boroughCode%20%3A_3_1_4_2_5',
                batchId: 4
            };
            connector.ajaxConnector.setConnection(url, connector.payloadToString(payload), callback_function);
            connector.ajaxConnector.connect();
        },
        getNeighborhoods: function (callback_function) {
            var url = 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/dwr/call/plaincall/RestaurantSpringService.getNeighborHoodNames.dwr';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchBrowse.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}686',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getNeighborHoodNames',
                'c0-id': 0,
                'c0-param0': 'string:boroughName%3A_BROOKLYN_MANHATTAN_QUEENS_STATEN%20ISLAND_BRONX',
                batchId: 1
            };
            connector.ajaxConnector.setConnection(url, connector.payloadToString(payload), callback_function);
            connector.ajaxConnector.connect();
        },
        getGeoData: function(camis_id, callback_function) {
            var url ='';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchDetails.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}199',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getRestaurantDetailsMapInfo',
                'c0-id': camis_id,
                'c0-param0': 'string:' + camis_id ,
                batchId: 1
            };
            //using the camis_id as the id to tie the async response back to the correct restaurant.
            connector.ajaxConnector.setConnection(url, connector.payloadToString(payload), callback_function);
            connector.ajaxConnector.connect();
        },
        getInspections: function(camis_id, callback_function) {
            var url ='http://a816-restaurantinspection.nyc.gov/RestaurantInspection/dwr/call/plaincall/RestaurantSpringService.getRestaurantDetails.dwr';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchDetails.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}199',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getRestaurantDetails',
                'c0-id': camis_id,
                'c0-param0': 'string:restaurantInspectionPK.camis%20%3A%20' + camis_id ,
                batchId: 1
            };
            //using the camis_id as the id to tie the async response back to the correct restaurant.
            connector.ajaxConnector.setConnection(url, connector.payloadToString(payload), callback_function);
            connector.ajaxConnector.connect();
        },
        getViolationDetails: function (camis_id, date, program, callback_function) {
            date = urlEncode(date);
            var url ='http://a816-restaurantinspection.nyc.gov/RestaurantInspection/dwr/call/plaincall/RestaurantSpringService.getViolationDetails.dwr';
            var payload = {
                callCount: 1,
                page: '/RestaurantInspection/SearchDetails.do',
                httpSessionId: '',
                scriptSessionId: '${scriptSessionId}199',
                'c0-scriptName': 'RestaurantSpringService',
                'c0-methodName': 'getViolationDetails',
                'c0-id': camis_id,
                'c0-param0': 'string:restaurantInspectionPK.camis%20%40' + camis_id + '%0ArestaurantInspectionPK.inspectionDate%20%40' + date + '%0ArestaurantInspectionPK.program%20%40' + program,
                batchId: 1
            };
            //using the camis_id as the id to tie the async response back to the correct restaurant.
            connector.ajaxConnector.setConnection(url, connector.payloadToString(payload), callback_function);
            connector.ajaxConnector.connect();
        }
    };
}();

module.exports = restaurantConnector;