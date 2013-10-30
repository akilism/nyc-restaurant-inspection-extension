/**
 * Created by akil.harris on 10/27/13.
 */

var restaurantGrader = {
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
            restaurantData.name = this.cleanName(restaurantData.name);
//            console.log("https://pure-depths-9510.herokuapp.com/getRestaurantGrade?name=" + restaurantData.name + "&zip_code=" + restaurantData.zip_code + "&street_name=" + restaurantData.street_name + "&building=" + restaurantData.building + "&telephone=" + restaurantData.telephone);
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
    getRestaurantGrade: function() {
        var request = new XMLHttpRequest();
        var url = this.fetchURL();

        if (url == null) { return; }

        request.open("GET", url, true);
        request.onload = this.setInspectionData.bind(this);
        request.send(null);
    },
    setInspectionData: function (xhrEvent) {
        var grade_details = JSON.parse(xhrEvent.target.response);

        //must have not matched or some other server error.
        if(grade_details.error) { return; }

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

            var url = window.location.href;

            if(url.toLowerCase().indexOf('yelp') != -1) {
                $('#bizPhone').after('<div class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            } else if (url.toLowerCase().indexOf('seamless') != -1){
                $('.consumer').after('<div class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            } else if (url.toLowerCase().indexOf('zagat') != -1){
                $('.date').after('<div class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            } else if (url.toLowerCase().indexOf('grubhub') != -1){
                $('h3').after('<div class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            } else if (url.toLowerCase().indexOf('menupages') != -1){
                $('h1').after('<div class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            } else if (url.toLowerCase().indexOf('delivery') != -1){
                $('.top_name').after('<div style="float: none;" class="inspection-holder ' + holder_class + '"><img class="inspection-grade" src="' + grade_details.grade_image + '">' + date_details + '</div>');
            }
        }
    }
};


$(document).ready(function (){
    restaurantGrader.getRestaurantGrade();

});