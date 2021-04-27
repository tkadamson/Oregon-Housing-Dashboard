let counties = ['Baker','Benton','Clackamas','Clatsop', 'Columbia',
            'Coos', 'Crook', 'Curry', 'Deschutes', 'Douglas', 'Gilliam', 
            'Grant', 'Harney', 'Hood', 'Jackson', 'Jefferson', 'Josephine',
            'Klamath', 'Lake', 'Lane', 'Lincoln', 'Linn', 'Malheur', 'Marion',
            'Morrow', 'Multnomah', 'Polk', 'Sherman', 'Tillamook', 'Umatilla', 
            'Union', 'Wallowa', 'Wasco', 'Washington', 'Wheeler', 'Yamhill'];

var popData = [];
var incomeData = [];
var rentData = [];
var percHomeoweners = [];
var percRenters = [];
var newHousing = [];

for (let i=0; i < counties.length; i++) {
    d3.json(`http://127.0.0.1:5000/api/v1/${counties[i]}`).then(countyData => {

        //console.log(countyData);

        popData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].pop)]);

        incomeData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].county_median_income)]);

        let homeowners = Number(countyData[0].homeowners) / (Number(countyData[0].homeowners) + (Number(countyData[0].renters)));

        percHomeoweners.push([`us-or-${countyData[0].county_fips}`, homeowners]);

        let renters = Number(countyData[0].renters) / (Number(countyData[0].homeowners) + (Number(countyData[0].renters)));

        percRenters.push([`us-or-${countyData[0].county_fips}`, renters]);

        rentData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].county_median_rent_2019)]);

        newHousing.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].new_housing)]);

    });
};

console.log(popData);
console.log(incomeData);
console.log(rentData);
console.log(percHomeoweners);
console.log(percRenters);
console.log(newHousing);

function buildMap(metric, div, label) {
    Highcharts.getJSON("https://code.highcharts.com/mapdata/countries/us/us-or-all.geo.json", 
    function (geojson){

        //console.log(geojson);
        Highcharts.mapChart(div, {
            chart: {
                map: geojson
            },

            title: {
                text: label
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                tickPixelInterval: 100
            },
            
            series: [{
                data: metric,
                mapData: Highcharts.maps["us/us-or-all"],
                keys: ['hc-key', 'value'],
                joinBy: 'hc-key',
                name: label,
                states: {
                    hover: {
                    color: '#a4edba'
                    }
                },

                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}'
                },

            }]
        })   
    });
};

buildMap(popData, "map1", "Population");
buildMap(incomeData, "map2", "Median Income");
buildMap(rentData, "map3", "Median Rent");
buildMap(percRenters, "map4", "Renters as a % of Housholds");
buildMap(percHomeoweners, "map5", "Homeowners as a % of Housholds");
buildMap(newHousing, "map6", "New Housing Units Built 2014 or Later");