/**
 * Created by akil.harris on 10/27/13.
 */

var restaurantGrader = {
    isFlyPage: false,
    sanitizeTelephone: function (num) {
        //we only want the digits.
        return num.replace('(','').replace(')','').replace(/-/g,'').replace(/ /g,'');
    },
    cleanName: function(name) {
        //Massage the restaurant name into a sightly easier to deal with format.
        name = name.replace("&","And").replace("'","").replace(/-/g,'').replace(/restaurant/i,'');

        if (name.indexOf("(") !== -1) {
            name = name.slice(0, name.indexOf("(")).trim();
        }

        return name;
    },
    fetchURL: function() {
        var url = window.location.href;

        var restaurantData;

        if(url.toLowerCase().indexOf('yelp') !== -1) {
            restaurantData = this.fetchDataYelp();
        } else if (url.toLowerCase().indexOf('seamless') !== -1) {
            restaurantData = this.fetchDataSeamless();
        } else if (url.toLowerCase().indexOf('zagat') !== -1) {
            restaurantData = this.fetchDataZagat();
        } else if (url.toLowerCase().indexOf('grubhub') !== -1) {
            restaurantData = this.fetchDataGrubhub();
        } else if (url.toLowerCase().indexOf('menupages') !== -1) {
            restaurantData = this.fetchDataMenuPages();
        } else if (url.toLowerCase().indexOf('delivery') !== -1) {
            if (url.toLowerCase().indexOf('search') < 0) {
                restaurantData = this.fetchDataDelivery();
            }
        }

        if (restaurantData) {
            var zips = [10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10009, 10010, 10011, 10012, 10013, 10014, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10044, 10055, 10057, 10065, 10069, 10075, 10104, 10105, 10106, 10110, 10111, 10112, 10115, 10118, 10119, 10121, 10123, 10128, 10153, 10154, 10168, 10170, 10171, 10174, 10175, 10176, 10179, 10199, 10270, 10280, 10281, 10282, 10285, 10301, 10302, 10303, 10304, 10305, 10306, 10307, 10308, 10309, 10310, 10311, 10312, 10314, 10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470, 10471, 10472, 10473, 10474, 10475, 11001, 11004, 11005, 11040, 11101, 11102, 11103, 11104, 11105, 11106, 11109, 11201, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 11223, 11224, 11225, 11226, 11228, 11229, 11230, 11231, 11232, 11233, 11234, 11235, 11236, 11237, 11238, 11239, 11242, 11249, 11256, 11354, 11355, 11356, 11357, 11358, 11360, 11361, 11362, 11363, 11364, 11365, 11366, 11367, 11368, 11369, 11370, 11371, 11372, 11373, 11374, 11375, 11377, 11378, 11379, 11385, 11411, 11412, 11413, 11414, 11415, 11416, 11417, 11418, 11419, 11420, 11421, 11422, 11423, 11426, 11427, 11428, 11429, 11430, 11432, 11433, 11434, 11435, 11436, 11451, 11691, 11692, 11693, 11694, 11697];
            if (zips.indexOf(parseInt(restaurantData.zip_code, 10)) === -1) { return null; }

            restaurantData.name = this.cleanName(restaurantData.name);
            return "https://pure-depths-9510.herokuapp.com/getRestaurantGrade?name=" + restaurantData.name + "&zip_code=" + restaurantData.zip_code + "&street_name=" + restaurantData.street_name + "&building=" + restaurantData.building + "&telephone=" + restaurantData.telephone;
        }

        return null;
    },
    fetchDataZagat: function () {
        var name = $('[itemprop="name"]').text().trim();
        var street_address_raw = $('[itemprop=streetAddress]').text().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('[itemprop=postalCode]').text().trim();
        var raw_text = $('[itemprop=address]').text().trim();
        var telephone = this.sanitizeTelephone(raw_text.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)[0]);
        var address_chunks;
        var space_index;

        if (street_address_raw.indexOf(' and ') !== -1) {
            address_chunks = street_address_raw.split(' and ');
            space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        } else {
            space_index = street_address_raw.indexOf(' ');
            building = street_address_raw.substring(0, space_index).trim();
            street_name = street_address_raw.substring(space_index, street_address_raw.length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }


        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    fetchDataGrubhub: function () {
        var name = $('[itemprop="name"]').text().trim();
        var street_address_raw = $('[itemprop=streetAddress]').text().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('[itemprop=postalCode]').text().trim();
        var telephone = this.sanitizeTelephone($('[itemprop=telephone]').text().trim());
        var address_chunks;
        var space_index;

        if (street_address_raw.indexOf(' and ') !== -1) {
            address_chunks = street_address_raw.split(' and ');
            space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        } else {
            space_index = street_address_raw.indexOf(' ');
            building = street_address_raw.substring(0, space_index).trim();
            street_name = street_address_raw.substring(space_index, street_address_raw.length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }


        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    fetchDataMenuPages: function () {
        var name = $('h1').text().trim();
        var street_address_raw = $('[class="addr street-address"]').text().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('.postal-code').text().trim();
        var telephone = this.sanitizeTelephone($('.phonenew').text().trim());
        var address_chunks;
        var space_index;

        if (street_address_raw.indexOf(' and ') !== -1) {
            address_chunks = street_address_raw.split(' and ');
            space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        } else {
            space_index = street_address_raw.indexOf(' ');
            building = street_address_raw.substring(0, space_index).trim();
            street_name = street_address_raw.substring(space_index, street_address_raw.length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }


        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    fetchDataSeamless: function () {
        var name = $('#VendorName').text().trim();
        var street_address_raw = $('#RestaurantAddress > [itemprop=streetAddress]').html().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('#RestaurantAddress > [itemprop=postalCode]').text().trim();
        var telephone = this.sanitizeTelephone($('#RestaurantAddress > [itemprop=telephone]').text());

        if (street_address_raw.indexOf('&nbsp;') !== -1) {
            var address_chunks = street_address_raw.split('&nbsp;');
            var space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }

        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    fetchDataYelp: function () {
        var name = $('[itemprop="name"]').text().trim();
        var street_address_raw = $('[itemprop=streetAddress]').text().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('[itemprop=postalCode]').text().trim();
        var telephone = this.sanitizeTelephone($('[itemprop=telephone]').text());
        var address_chunks;
        var space_index;

        if (street_address_raw.indexOf(' and ') !== -1) {
            address_chunks = street_address_raw.split(' and ');
            space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        } else {
            space_index = street_address_raw.indexOf(' ');
            building = street_address_raw.substring(0, space_index).trim();
            street_name = street_address_raw.substring(space_index, street_address_raw.length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }

        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    fetchDataDelivery: function () {
        var name = $('[itemprop="name"]').text().trim();
        var street_address_raw = $('[itemprop=streetAddress]').text().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('[itemprop=postalCode]').text().trim();
        var telephone = this.sanitizeTelephone(($('[itemprop=telephone]').text().trim()) ? $('[itemprop=telephone]').text().trim() : "");
        var address_chunks;
        var space_index;

        if (street_address_raw.indexOf(' and ') !== -1) {
            address_chunks = street_address_raw.split(' and ');
            space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        } else {
            space_index = street_address_raw.indexOf(' ');
            building = street_address_raw.substring(0, space_index).trim();
            street_name = street_address_raw.substring(space_index, street_address_raw.length).trim();
        }

        space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            street_name = this.getStreetType(street_name, space_index);
        }


        return {
            name       : name,
            zip_code   : zip_code,
            street_name: street_name,
            building   : building,
            telephone  : telephone
        }
    },
    getStreetType: function(street_name, space_index) {
        var suffix = street_name.substring(space_index, street_name.length).trim();

        street_name = street_name.replace(suffix, '');

        suffix = suffix.replace('.','');

        switch(suffix.toLowerCase()) {
            case 'rd':
                suffix = 'Road';
                break;
            case 'st':
                suffix = 'Street';
                break;
            case 'ave':
                street_name.toLowerCase().replace("nd ", " ").replace("st ", " ").replace("th ", " ");
                suffix = 'Avenue';
                break;
            case 'pl':
                suffix = 'Place';
                break;
            case 'ln':
                suffix = 'Lane';
        }

        return street_name + suffix;
    },
    setLoader: function() {

        var url = window.location.href;
        var html = '<p id="searching"><span>searching</span></p>';
        var fly = false;
        var yelpNew = false;

        if(url.toLowerCase().indexOf('yelp') != -1) {
            var iconedList = $('div.summary ul.iconed-list');
            $('[itemprop="title"]').each(function (index){
                var text = $(this).text().toLowerCase();

                //new yelp look
                if(iconedList.children) {
                  yelpNew = true;
                } else if ((text.indexOf('food') !== -1) || (text.indexOf('restaurants') !== -1)) {
                    fly = true;
                }
            });

            this.yelpNew = yelpNew;
            this.isFlyPage = fly;
            if (this.yelpNew) {
              iconedList.append('<li id="inspection_holder" class="yelp-new inspection-holder">'
                  + html + '</li>');
            }
            if (this.isFlyPage) {
                $('#bizPhone').after('<div id="inspection_holder" class="yelp inspection-holder" style="float: none;">'
                    + html + '</div>');
            }
        } else if (url.toLowerCase().indexOf('seamless') != -1){
            $('.consumer').after('<div id="inspection_holder" class="seamless inspection-holder" style="float: none;">'
                + html + '</div>');
        } else if (url.toLowerCase().indexOf('zagat') != -1){
            $('.date').after('<div id="inspection_holder" class="zagat inspection-holder" style="float: none;">'
                + html + '</div>');
        } else if (url.toLowerCase().indexOf('grubhub') != -1){
            $('h3').after('<div id="inspection_holder" class="grubhub inspection-holder" style="float: none;">'
                + html + '</div>');
        } else if (url.toLowerCase().indexOf('menupages') != -1){

            if ($('[class="addr street-address"]').text() !== "") {
                $('h1').after('<div id="inspection_holder" class="menupages inspection-holder" style="float: none;">'
                    + html + '</div>');
            }
        } else if (url.toLowerCase().indexOf('delivery') !== -1){
            this.isFlyPage = true;
            $('.top_name').after('<div id="inspection_holder" class="delivery inspection-holder" style="float: none;">'
                + html + '</div>');
        }

//        var $e = $('#searching span');
//        $e.addClass('animate');
    },
    inValidURL: function() {
        var url = this.fetchURL();

        if (url) { url = url.toLowerCase() } else { return false; }

        if ((url.indexOf('/members/') !== -1) ||
            (url.indexOf('account.') !== -1) ||
            (url.indexOf('order_confirm.') !== -1) ||
            (url.indexOf('order_process.') !== -1) ){
            return true;
        }

        return false;
    },
    getRestaurantGrade: function() {

        if (this.inValidURL()) {
            return;
        }

        var url = this.fetchURL();

        if (url == null) { return; }

        this.setLoader();

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = this.setInspectionData.bind(this);
        request.send(null);
    },
    setInspectionData: function (xhrEvent) {

        var grade_details = JSON.parse(xhrEvent.target.response);
        var $results;

        //must have not matched or some other server error.
        if(grade_details.error) {

            $results = $('<p id="no_results"><span class="letter_1">N</span><span class="letter_2">o</span><span class="letter_3">&nbsp;</span><span class="letter_4">R</span><span class="letter_5">e</span><span class="letter_6">s</span><span class="letter_7">u</span><span class="letter_8">l</span><span class="letter_9">t</span><span class="letter_10">s</span></p>');
            $('#searching').fadeOut(250, function () {
                $results.fadeOut(0);
                $(".inspection-holder").append($results);
                $results.fadeIn(150);
//                $("#no_results span").addClass("animate");
            });
            return;
        }

        if(grade_details) {
            var date_details = "";
            var holder_class;

            switch (grade_details.current_grade) {
                case "A":
                    holder_class = "holder-a";
                    grade_details.grade_image = chrome.extension.getURL("content/NYCRestaurant_A.gif");
                    date_details = '<div id="inspection-details">' +
                                   '<p class="points grade-a">' + grade_details.score_violations + 'pts</p>' +
                                   '<p class="inspection-label">Last NYC Inspection:</p>' +
                                   '<p class="grade-a">' + grade_details.last_inspection_date + '</p></div>';
                    break;
                case "B":
                    holder_class = "holder-b";
                    grade_details.grade_image = chrome.extension.getURL("content/NYCRestaurant_B.gif");
                    date_details = '<div id="inspection-details">' +
                        '<p class="points grade-b">' + grade_details.score_violations + 'pts</p>' +
                        '<p class="inspection-label">Last NYC Inspection:</p>' +
                        '<p class="grade-b">' + grade_details.last_inspection_date + '</p></div>';
                    break;
                case "C":
                    holder_class = "holder-c";
                    grade_details.grade_image = chrome.extension.getURL("content/NYCRestaurant_C.gif");
                    date_details = '<div id="inspection-details">' +
                        '<p class="points grade-c">' + grade_details.score_violations + 'pts</p>' +
                        '<p class="inspection-label">Last NYC Inspection:</p>' +
                        '<p class="grade-c">' + grade_details.last_inspection_date + '</p></div>';
                    break;
                case "Z":
                    holder_class = "holder-z";
                    grade_details.grade_image = chrome.extension.getURL("content/NYCRestaurant_Z.gif");
                    date_details = '<div id="inspection-details">' +
                        '<p class="points grade-z">' + grade_details.score_violations + 'pts</p>' +
                        '<p class="inspection-label">Last NYC Inspection:</p>' +
                        '<p class="grade-z">' + grade_details.last_inspection_date + '</p></div>';
                    break;
            }

            $results = $('<img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details);

            $('#searching').fadeOut(250, function () {
                $results.fadeOut(0);
                $(".inspection-holder").append($results);
                $results.fadeIn(125);
            });
        }
    }
};


$(document).ready(function (){
    restaurantGrader.getRestaurantGrade();

});