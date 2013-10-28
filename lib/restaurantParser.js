/**
 * Created by akil.harris on 10/14/13.
 */
connections = require('./restaurantConnections');

var restaurantParser = function () {
    var restaurants = [];

    var cleanResponseBody = function (start, end, response) {
        response = response.slice(response.indexOf(start));
        response = response.substring(0, response.indexOf(end));
        var re = /  +/g;
        response = response.replace(re, ' ');
        var re2 = /\"/g;
        response = response.replace(re2, '');
        return response;
    };

    var fetchGeoDataByRestaurantId = function (camis_id, callback) {
        connections.getGeoData(camis_id, callback);
    };

    var fetchBoroughByCode = function (borough_code) {
        switch(borough_code){
            case 1:
                return 'Manhattan';
            case 2:
                return 'Bronx';
            case 3:
                return 'Brooklyn';
            case 4:
                return 'Queens';
            case 5:
                return 'Staten Island';
        }
    }

    var parseInspectionForRestaurant = function (response) {
    //Sample Data
    //#DWR-INSERT
    //#DWR-REPLY
    //var s0={};var s16={};var s1={};var s17={};var s2={};var s18={};var s3={};var s19={};var s4={};var s20={};var s5={};var s21={};var s6={};var s22={};var s7={};var s23={};var s8={};var s24={};var s9={};var s25={};var s10={};var s26={};var s11={};var s27={};var s12={};var s28={};var s13={};var s29={};var s14={};var s30={};var s15={};var s31={};
    //s0.boroughCode="2";s0.building="4120";s0.cuisine="Latin (Cuban, Dominican, Puerto Rican, South & Central American)";s0.currentGrade="A";s0.displayOrder=1;s0.goldenApple="N";s0.gradeDate=new Date(1359435600000);s0.gradeDateStr="01/29/2013";s0.inSync="N";s0.inspectionDateStr="01/29/2013";s0.inspectionGroup="GRADED";s0.inspectionType="A";s0.latest="Y";s0.name=" 1 SABOR LATINO RESTAURANT";s0.nameAndScore=null;s0.nameFirstLetter="#";s0.neighborCode=null;s0.percentRank=null;s0.phoneNumber="7186532222";s0.preAdjudication="N";s0.restaurantGeocode=null;s0.restaurantInspectionPK=s16;s0.score=13;s0.scoreAndName=null;s0.searchName="# 1 SABOR LATINO RESTAURANT";s0.serviceDescription="OTHER";s0.street="WHITE PLAINS ROAD";s0.ttlCriticalViolation=null;s0.ttlViolation=null;s0.version=null;s0.violationGroup="1";s0.vpsSuspended="N";s0.zipCode="10466";
    //s16.camis="41336841";s16.inspectionDate=new Date(1359435600000);s16.program="FS";
    //s1.boroughCode="2";s1.building="4120";s1.cuisine="Latin (Cuban, Dominican, Puerto Rican, South & Central American)";s1.currentGrade="C";s1.displayOrder=3;s1.goldenApple="N";s1.gradeDate=new Date(1346212800000);s1.gradeDateStr="08/29/2012";s1.inSync="N";s1.inspectionDateStr="08/29/2012";s1.inspectionGroup="GRADED";s1.inspectionType="B";s1.latest="N";s1.name=" 1 SABOR LATINO RESTAURANT";s1.nameAndScore=null;s1.nameFirstLetter="#";s1.neighborCode=null;s1.percentRank=null;s1.phoneNumber="7186532222";s1.preAdjudication="N";s1.restaurantGeocode=null;s1.restaurantInspectionPK=s17;s1.score=26;s1.scoreAndName=null;s1.searchName="# 1 SABOR LATINO RESTAURANT";s1.serviceDescription="OTHER";s1.street="WHITE PLAINS ROAD";s1.ttlCriticalViolation=null;s1.ttlViolation=null;s1.version=null;s1.violationGroup=null;s1.vpsSuspended="N";s1.zipCode="10466";
    //s17.camis="41336841";s17.inspectionDate=new Date(1346212800000);s17.program="FS";
    //s2.boroughCode="2";s2.building="4120";s2.cuisine="Latin (Cuban, Dominican, Puerto Rican, South & Central American)";s2.currentGrade="B";s2.displayOrder=2;s2.goldenApple="N";s2.gradeDate=new Date(1326949200000);s2.gradeDateStr="01/19/2012";s2.inSync="N";s2.inspectionDateStr="01/19/2012";s2.inspectionGroup="GRADED";s2.inspectionType="B";s2.latest="N";s2.name=" 1 SABOR LATINO RESTAURANT";s2.nameAndScore=null;s2.nameFirstLetter="#";s2.neighborCode=null;s2.percentRank=null;s2.phoneNumber="7186532222";s2.preAdjudication="N";s2.restaurantGeocode=null;s2.restaurantInspectionPK=s18;s2.score=11;s2.scoreAndName=null;s2.searchName="# 1 SABOR LATINO RESTAURANT";s2.serviceDescription="OTHER";s2.street="WHITE PLAINS ROAD";s2.ttlCriticalViolation=null;s2.ttlViolation=null;s2.version=null;s2.violationGroup=null;s2.vpsSuspended="N";s2.zipCode="10466";
    //s18.camis="41336841";s18.inspectionDate=new Date(1326949200000);s18.program="FS";
    //s3.boroughCode="2";s3.building="4120";s3.cuisine="Latin (Cuban, Dominican, Puerto Rican, South & Central American)";s3.currentGrade="B";s3.displayOrder=2;s3.goldenApple="N";s3.gradeDate=new Date(1316664000000);s3.gradeDateStr="09/22/2011";s3.inSync="N";s3.inspectionDateStr="09/22/2011";s3.inspectionGroup="GRADED";s3.inspectionType="B";s3.latest="N";s3.name=" 1 SABOR LATINO RESTAURANT";s3.nameAndScore=null;s3.nameFirstLetter="#";s3.neighborCode=null;s3.percentRank=null;s3.phoneNumber="7186532222";s3.preAdjudication="N";s3.restaurantGeocode=null;s3.restaurantInspectionPK=s19;s3.score=20;s3.scoreAndName=null;s3.searchName="# 1 SABOR LATINO RESTAURANT";s3.serviceDescription="OTHER";s3.street="WHITE PLAINS ROAD";s3.ttlCriticalViolation=null;s3.ttlViolation=null;s3.version=null;s3.violationGroup=null;s3.vpsSuspended="N";s3.zipCode="10466";
    //dwr.engine._remoteHandleCallback('0','0',[s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15]);

        var raw_array = cleanResponseBody('s0.boroughCode', 'dwr', response).split('\n');
        var tempInspection = '';
        var data = [];
        var inspections = [];

        for (var x = 1; x <= raw_array.length; x += 2) {
            if ((raw_array[x] === '') || (!raw_array[x])) { break; }

            data = parseSingleInspection(raw_array[x-1], raw_array[x]);
            tempInspection = {
                borough_code: parseInt(data['boroughCode'], 10),
                building: parseInt(data['building'], 10),
                cuisine: data['cuisine'],
                current_grade: data['currentGrade'],
                grade_image: setGradeImage(data['currentGrade'].trim()),
                sort_order: parseInt(data['displayOrder'], 10),
                golden_apple: ((data['goldenApple'] === 'N') || (!data['goldenApple'])) ? false : true,
                grade_date: new Date(parseInt(data['gradeDate'].replace('new Date(','').replace(')',''), 10)),
                str_grade_date: data['gradeDateStr'],
                in_sync: ((data['inSync'] === 'N') || (!data['inSync'])) ? false : true,
                inspection_date: new Date(parseInt(data['inspectionDate'].replace('new Date(','').replace(')'), 10)),
                str_inspection_date: data['inspectionDateStr'],
                inspection_group: data['inspectionGroup'],
                inspection_type: data['inspectionType'],
                latest: (data['latest'] === 'Y') ? true : false,
                name: data['name'],
                name_and_score: data['nameAndScore'],
                name_first_letter: data['nameFirstLetter'],
                neighbor_code: data['neighborCode'],
                percent_rank: data['percentRank'],
                phone_number: data['phoneNumber'],
                pre_adjudication: (data['preAdjudication'] === 'Y') ? true : false,
                restaurant_geo_code: data['restaurantGeocode'],
                restaurant_inspection_pk: data['restaurantInspectionPK'],
                score: parseInt(data['score'] ,10),
                score_and_name: data['scoreAndName'],
                search_name: data['searchName'],
                service_description: data['serviceDescription'],
                street: data['street'],
                ttl_critical_violation: data['ttlCriticalViolation'],
                ttl_violation: data['ttlViolation'],
                version: data['version'],
                violation_group: data['violationGroup'],
                vps_suspended: (data['vpsSuspended'] === 'Y') ? true : false,
                zip_code: data['zipCode'],
                camis: parseInt(data['camis'], 10),
                program: data['program']
            };

            inspections.push(tempInspection);
        }

        //console.log(inspections);
        return inspections;
    };

    var parseDetailsForInspection = function (response) {
//Sample Data
//#DWR-INSERT
//#DWR-REPLY
//var s0=[];var s2={};var s1=[];var s3={};var s4={};var s5={};s0[0]=s2;
//s2.restDetailsActionCode="D         ";s2.restDetailsActionDesc="Violations were cited in the following area(s).";
//s1[0]=s3;s1[1]=s4;s1[2]=s5;
//s3.restDetailsViolationCategory="Sanitary Violations";s3.restDetailsViolationCode="04N";s3.restDetailsViolationDesc="Filth flies or food/refuse/sewage-associated (FRSA) flies present in facility\u2019s food and/or non-food areas. Filth flies include house flies, little house flies, blow flies, bottle flies and flesh flies. Food/refuse/sewage-associated flies include fruit flies, drain flies and Phorid flies.";s3.restIsCritical="Y";
//s4.restDetailsViolationCategory="Sanitary Violations";s4.restDetailsViolationCode="08A";s4.restDetailsViolationDesc="Facility not vermin proof. Harborage or conditions conducive to attracting vermin to the premises and/or allowing vermin to exist.";s4.restIsCritical="N";
//s5.restDetailsViolationCategory="Sanitary Violations";s5.restDetailsViolationCode="10F";s5.restDetailsViolationDesc="Non-food contact surface improperly constructed. Unacceptable material used. Non-food contact surface or equipment improperly maintained and/or not properly sealed, raised, spaced or movable to allow accessibility for cleaning on all sides, above and underneath the unit.";s5.restIsCritical="N";
//dwr.engine._remoteHandleCallback('3','0',[s0,s1]);

        var raw_array = cleanResponseBody('s0[0]', 'dwr', response).split('\n');
        var tempDetails = '';
        var data = [];
        var details_data = [];
        var base_row = '';

        var base_field = raw_array[0].split('=')[1].replace(';','');

        for (var x in raw_array) {

            if ((raw_array[x] === '') || (!raw_array[x])) { break; }
            if (parseInt(x, 10) === 0) { continue; }
            if (raw_array[x].indexOf('[0]') !== -1) { continue; }


            if (raw_array[x].indexOf(base_field) == 0) {
                //on base field row:
                base_row = raw_array[x];
                data = parseViolationDetails(base_row);
                details_data = {
                    action_code: data['restDetailsActionCode'],
                    action_description: data['restDetailsActionDesc'],
                    violation_details: Array()
                };
            } else {
                //on a details row.
                data = parseViolationDetails(raw_array[x]);
                tempDetails = {
                    details_violation_category: data['restDetailsViolationCategory'],
                    details_violation_code: data['restDetailsViolationCode'],
                    details_violation_description: data['restDetailsViolationDesc'],
                    is_critical: (data['restIsCritical'] === 'Y') ? true : false
                };
                details_data.violation_details.push(tempDetails);
            }
        }
        //console.log(details_data);
        return details_data;
    }

    var setGradeImage = function (grade) {
//        http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_A.gif
        switch (grade) {
            case 'A':
                return 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_A.gif';
            case 'B':
                return 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_B.gif';
            case 'C':
                return 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_C.gif';
//            case 'D':
//                return 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_A.gif';
//            case 'F':
//                return 'http://a816-restaurantinspection.nyc.gov/RestaurantInspection/images/NYCRestaurant_A.gif';
            default:
                return "";
        }
    }

    var parseRestaurantBatch = function (response) {
        restaurants = [];
//Sample response body
//#DWR-INSERT
//#DWR-REPLY
//var s0={};var s1={};var s2={};var s3={};var s4={};var s5={};var s6={};var s7={};var s8={};var s9={};var s10={};var s11={};var s12={};var s13={};var s14={};var s15={};var s16={};var s17={};var s18={};var s19={};
//s0.brghCode="2";s0.cuisineType="Latin (Cuban, Dominican, Puerto Rican, South & Central American)";s0.lastInspectedDate="01/29/2013";s0.lastInspectionDate=null;s0.restBuilding="4120";s0.restCamis="41336841";s0.restCurrentGrade="A";s0.restGoldenApple=null;s0.restProgram="FS";s0.restViolationGroup="1";s0.restZipCode="10466";s0.restaurantName=" 1 SABOR LATINO RESTAURANT";s0.restaurantSearchName="# 1 SABOR LATINO RESTAURANT";s0.scoreViolations=13;s0.stName="WHITE PLAINS ROAD";s0.telephone="7186532222";
//s1.brghCode="1";s1.cuisineType="French";s1.lastInspectedDate="05/21/2013";s1.lastInspectionDate=null;s1.restBuilding="462";s1.restCamis="41352260";s1.restCurrentGrade="A";s1.restGoldenApple=null;s1.restProgram="FS";s1.restViolationGroup="1";s1.restZipCode="10013";s1.restaurantName=" LECOLE";s1.restaurantSearchName="/ L\'ECOLE";s1.scoreViolations=12;s1.stName="BROADWAY";s1.telephone="2122193300";
//s2.brghCode="1";s2.cuisineType="Caf\u00E9/Coffee/Tea";s2.lastInspectedDate="07/30/2013";s2.lastInspectionDate=null;s2.restBuilding="45";s2.restCamis="41496092";s2.restCurrentGrade="A";s2.restGoldenApple=null;s2.restProgram="FS";s2.restViolationGroup="1";s2.restZipCode="10012";s2.restaurantName=" the SquareSTARBUCKS";s2.restaurantSearchName="@ the Square(STARBUCKS)";s2.scoreViolations=13;s2.stName="WEST    4 STREET";s2.telephone="2129953443";
//s3.brghCode="1";s3.cuisineType="Chinese/Japanese";s3.lastInspectedDate="05/16/2013";s3.lastInspectionDate=null;s3.restBuilding="1425";s3.restCamis="41586422";s3.restCurrentGrade="A";s3.restGoldenApple=null;s3.restProgram="FS";s3.restViolationGroup="1";s3.restZipCode="10021";s3.restaurantName="1 AKI SUSHI";s3.restaurantSearchName="1 AKI SUSHI";s3.scoreViolations=8;s3.stName="YORK AVENUE";s3.telephone="2126288882";
//s19.brghCode="3";s19.cuisineType="Chinese";s19.lastInspectedDate="01/28/2013";s19.lastInspectionDate=null;s19.restBuilding="928";s19.restCamis="41448246";s19.restCurrentGrade="A";s19.restGoldenApple=null;s19.restProgram="FS";s19.restViolationGroup="1";s19.restZipCode="11219";s19.restaurantName="100 FUN BILLIARD";s19.restaurantSearchName="100 FUN BILLIARD";s19.scoreViolations=2;s19.stName="60 STREET";s19.telephone="7188806188";
//dwr.engine.do.something()


        var raw_array = cleanResponseBody('s0.brghCode', 'dwr', response).split('\n');
        var tempRest = '';
        var data = [];


        for (var x in raw_array)
        {
            if ((raw_array[x] === '') || (raw_array[x] === null)) { break; }

            data = parseSingleRestaurant(raw_array[x]);

            tempRest = {
                name: data['restaurantName'].trim(),
                search_name: data['restaurantSearchName'].trim(),
                camis: parseInt(data['restCamis'], 10),
                cuisine_type: data['cuisineType'].trim(),
                last_inspected_date: data['lastInspectedDate'],
                last_inspection_date: (data['lastInspectionDate'] === 'null') ? null : data['lastInspectionDate'],
                current_grade: data['restCurrentGrade'].trim(),
                golden_apple: ((data['restGoldenApple'] === 'null') || (data['restGoldenApple'] === 'N')) ? false : true,
                program: data['restProgram'].trim(),
                violation_group: parseInt(data['restViolationGroup'], 10),
                score_violations: parseInt(data['scoreViolations'], 10),
                telephone: data['telephone'],
                grade_image: setGradeImage(data['restCurrentGrade'].trim()),
                address: {
                    building: data['restBuilding'].trim(),
                    street_name: data['stName'].trim(),
                    zip_code: parseInt(data['restZipCode'], 10),
                    borough_code: parseInt(data['brghCode'], 10),
                    borough: fetchBoroughByCode(parseInt(data['brghCode'], 10))
                }
            };

//            fetchGeoDataByRestaurantId(tempRest.camis, populateGeoData);

            restaurants.push(tempRest);
        }

        //console.log(restaurants);
        return restaurants;
    };

    var populateGeoData = function (error, response, body) {
        if (error) {console.log(error); return;}

        if (response.statusCode === 200) {
            parseGeoDataBody(body);
        } else {
            console.log('response.statusCode: ' + response.statusCode + ' error: ' + error);
        }
    };

    var parseGeoDataBody = function (response) {
//Sample Data
//#DWR-INSERT
//#DWR-REPLY
//dwr.engine._remoteHandleCallback('2','0',{lat:40.8912353515625,lng:-73.85856628417969});

        response = response.replace('dwr.engine._remoteHandleCallback(','');
        response = response.replace(');','');
        var raw_data = response.split("{");
        var re = /\'/g;
        var restaurant_camis_id = parseInt(raw_data[0].split(',')[0].replace(re,''), 10);
        var raw_geo_data = raw_data[1].replace('{','').replace('lat:','').replace('lng:','').replace('}','').split(',');
        //console.log(restaurant_camis_id + ' - ' + raw_geo_data);
        for (var x in restaurants) {
            if ((restaurants[x] === '') || (!restaurants[x])) { break; }

            if (restaurants[x].camis === restaurant_camis_id) {
                restaurants[x].geo_data = {
                    lat: raw_geo_data[0],
                    lon: raw_geo_data[1]
                };
                restaurants[x].GeoJSON = {
                    type: "Point",
                    coordinates: [raw_geo_data[0], raw_geo_data[1]]
                };
                break;
            }
        }
    };

    var parseTotalResponse = function (response) {
//Sample response body:
//#DWR-INSERT
//#DWR-REPLY
//dwr.engine._remoteHandleCallback('4','0',25034);

        response = response.replace(');','');

        var last_index = response.lastIndexOf(',');
        var count = parseInt(response.slice(last_index + 1), 10);
        return count;
    };

    var parseNeighborhoodResponse = function (response) {
//Sample response body:
//#DWR-INSERT
//#DWR-REPLY
//s0.neighName="Allerton";s0.resZipCode="10469";
//s10.neighName="Battery Park City";s10.resZipCode="10280_10282";

//    response = response.slice(response.indexOf('s0.neighName'));
//    response = response.substring(0, response.indexOf('dwr'));
        var raw_array = cleanResponseBody('s0.neighName', 'dwr', response).split('\n');
        var temp = [];
        var neighborhood_name = '';
        var zip_codes = [];
        var raw_zips = '';
        var neighborhoods = [];

        for (var x in raw_array) {
            if (raw_array[x] === '') { break; }
            temp = raw_array[x].split(';');
            neighborhood_name = temp[0].split('=')[1];
            raw_zips = temp[1].split('=')[1];
            var str_zips = raw_zips.split("_");

            for (var i in str_zips) {
                zip_codes.push(parseInt(str_zips[i]));
            }
            neighborhoods.push({
                neighborhood_name: neighborhood_name,
                zip_codes: zip_codes
            });
            zip_codes = [];
        }

        //console.log(neighborhoods);
        return neighborhoods;
    };

    var parseViolationDetails = function (raw_data) {
        var temp = raw_data.split(';');
        var data = [];
        for (var x in temp) {
            if ((temp[x] === '') || (!temp[x])) { break; }

            var chunks = temp[x].split('=');
            data[chunks[0].slice(chunks[0].indexOf('.') + 1)] = (chunks[1] === 'null') ? null : chunks[1];
        }
        return data;
    };

    var parseSingleInspection = function (main_raw, sub_raw) {
        var temp_main = main_raw.split(';');
        var temp_sub = sub_raw.split(';');
        var data = [];

        for (var x in temp_main) {
            if ((temp_main[x] === '') || (!temp_main[x])) { break; }

            var chunks = temp_main[x].split('=');
            data[chunks[0].slice(chunks[0].indexOf('.') + 1)] = (chunks[1] === 'null') ? null : chunks[1];
        }

        for (var x in temp_sub) {
            if ((temp_sub[x] === '') || (!temp_sub[x])) { break; }

            var chunks = temp_sub[x].split('=');
            data[chunks[0].slice(chunks[0].indexOf('.') + 1)] = (chunks[1] === 'null') ? null : chunks[1];
        }

        return data;
    };

    var parseSingleRestaurant = function (raw_line) {
        var temp = raw_line.split(';');
        var data = [];

        for (var x in temp)
        {
            if ((temp[x] === null) || (temp[x] === '')) { break; }
            var chunks = temp[x].split('=');
            data[chunks[0].slice(chunks[0].indexOf('.') + 1)] = (chunks[1] === 'null') ? null : chunks[1];
        }

        return data;
    }

    return {
        parseInspectionForRestaurant: function (response) {
            return parseInspectionForRestaurant(response);
        },
        parseDetailsForInspection: function (response) {
            return parseDetailsForInspection(response);
        },
        parseRestaurantBatch: function (response) {
            return parseRestaurantBatch(response);
        },
        parseGeoDataBody: function (response) {
            return parseGeoDataBody(response);
        },
        parseTotalResponse: function (response) {
            return parseTotalResponse(response);
        },
        parseNeighborhoodResponse: function (response) {
            return parseNeighborhoodResponse(response);
        }
    }
}();

module.exports = restaurantParser;