/**
 *
 * Created by akil.harris on 8/21/13.
 *
 **/

var ajaxConnector = function () {

    var connection = {
        url : require('url'),
        str_url: '',
        payload: '',
        callback_function: null,
        retry_attempts_left: 0 //default of no retries.
    };

    var connect = function () {
        var request = require('request');
        request({
            url: connection.url.parse(connection.str_url),
            method: 'POST',
            body: connection.payload
        }, retry);
    };

    var retry = function(error, response, body) {
        if (error) { console.log("ERROR     : " + error); return; }

        if ((connection.retry_attempts_left > 0) && (response.statusCode !== 200)) {
            connect();
            connection.retry_attempts_left--;
        } else {
//            console.log('typeof     : ' + typeof (connection.callback_function));
            if (typeof (connection.callback_function) == 'function')
            {
//                console.log('connection.callback_function    :  ' + connection.callback_function);
                connection.callback_function(error, response, body);
            }

        }
    };

    return {
        connect: function () {
            connect();
        },
        getUrl: function () {
            return connection.str_url;
        },
        setPayload: function (payload) {
            connection.payload = payload;
        },
        setCallBack: function (callback_function) {
            connection.callback_function = callback_function;
        },
        setUrl: function(url) {
            connection.str_url = url;
        },
        setConnection: function (url, payload, callback_function) {
            connection.str_url = url;
            connection.payload = payload;
            connection.callback_function = callback_function;
        },
        setConnectionWithRetry: function (url, payload, callback_function, attempts) {
            connection.str_url = url;
            connection.payload = payload;
            connection.callback_function = callback_function;
            connection.retry_attempts_left = attempts;
        }
    }
}();

module.exports = ajaxConnector;


