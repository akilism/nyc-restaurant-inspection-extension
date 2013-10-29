/**
 * Created by akil.harris on 10/14/13.
 */



//these are the <th></th> tags that make up the header on the restaurants list.
$("#VendorsTable thead tr th:nth-child(2)").after("<th><a title='NYC Inspection Grade' href='#' class='inspection'><span>NYC Inspection Grade</span></a></th>");
$("#VendorsTable tbody tr td:nth-child(2)").each(function(index) {
    var name = $(this).children('h3').children('a').text().trim();
    var VendorName = $(this).children('h3').children('a').attr('rel').trim().replace('VendorName_','');
    console.log(name + " " + VendorName);
}).after("<td>test</td>");



$('.consumer').after('<br><img src="http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_A.gif">');

var sanitizeTelephone = function (num) {
    return num.replace('(','').replace(')','').replace('-','').replace(/ /g,'');
}

//var street_address_raw = '140 St. Nicholas Avenue&nbsp;(St. Nicholas Ave. & Stockholm St.)';

//var street_address_raw = $('#RestaurantAddress > [itemprop=streetAddress]').html().trim();
if (street_address_raw.indexOf('&nbsp;') !== -1) {
    var address_chunks = street_address_raw.split('&nbsp;');
    var space_index = address_chunks[0].indexOf(' ');
    building = address_chunks[0].substring(0, space_index).trim();
    street_address = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
}

//console.log(building);

space_index = street_address.lastIndexOf(' ');

if (space_index > 1) {
    var suffix = street_address.substring(space_index, street_address.length).trim();
//    console.log(suffix);

    street_address = street_address.replace(suffix, '');

    suffix = suffix.replace('.','');

    switch(suffix) {
        case 'Rd':
            suffix = 'Road';
            break;
        case 'St':
            suffix = 'Street';
            break;
        case 'Ave':
            suffix = 'Avenue';
            break;
        case 'Pl':
            suffix = 'Place';
            break;
        case 'Ln':
            suffix = 'Lane';
    }

    street_address = street_address + suffix;
}

//console.log(street_address);

var data = {
    name: name,
    building: building,
    street_address: street_address,
    zip_code: zip_code,
    telephone: telephone
};

var setInspectionData = function () {

};

var getRestaurantGrade = function(data) {
    var request = new XMLHttpRequest();
    request.onload = setInspectionData;
}

$.ajax({
    type: "GET",
    url: "http://pure-depths-9510.herokuapp.com/getRestaurantGrade?name=Satyr%20Grill&zip_code=11385&street_name=Cypress%20Avenue&building=1109&telephone=7184564745"
//    data: { name: "John", location: "Boston" }
}).done(function( msg ) {
    alert( "Data Saved: " + msg );
});



var restaurantGrader = {
    getRestaurantGrade: function() {
        var request = new XMLHttpRequest();
        request.open("GET", this.fetchURL, true);
        request.onload = this.setInspectionData.bind(this);
        request.send(null);
    },
    fetchURL: function() {
        var name = $('#VendorName').text().trim();
        var street_address_raw = $('#RestaurantAddress > [itemprop=streetAddress]').html().trim();
        var building = '';
        var street_name = '';
        var zip_code = $('#RestaurantAddress > [itemprop=postalCode]').text().trim();
        var telephone = sanitizeTelephone($('#RestaurantAddress > [itemprop=telephone]').text());

        if (street_address_raw.indexOf('&nbsp;') !== -1) {
            var address_chunks = street_address_raw.split('&nbsp;');
            var space_index = address_chunks[0].indexOf(' ');
            building = address_chunks[0].substring(0, space_index).trim();
            street_name = address_chunks[0].substring(space_index, address_chunks[0].length).trim();
        }

        var space_index = street_name.lastIndexOf(' ');

        if (space_index > 1) {
            var suffix = street_name.substring(space_index, street_name.length).trim();

            street_name = street_name.replace(suffix, '');

            suffix = suffix.replace('.','');

            switch(suffix) {
                case 'Rd':
                    suffix = 'Road';
                    break;
                case 'St':
                    suffix = 'Street';
                    break;
                case 'Ave':
                    suffix = 'Avenue';
                    break;
                case 'Pl':
                    suffix = 'Place';
                    break;
                case 'Ln':
                    suffix = 'Lane';
            }

            street_name = street_name + suffix;
        }

        return "http://pure-depths-9510.herokuapp.com/getRestaurantGrade?name=" + name + "&zip_code=" + zip_code + "&street_name=" + street_name + "&building=" + building + "&telephone=" + telephone;
    },
    setInspectionData: function (response) {

    },
    sanitizeTelephone: function (num) {
        return num.replace('(','').replace(')','').replace('-','').replace(/ /g,'');
    }
};