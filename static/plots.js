let countyName = "Baker"

createPlots(countyName);

function createPlots(countyName) {
    
    d3.json(`api/v1/${countyName}`).then(function(countyData) {
        console.log(countyData);

        let countyFips = countyData[0].county_fips;
        let countyName = countyData[0].county;
        let medianRent2015 = countyData[0].county_median_rent_2015;
        let medianRent2016 = countyData[0].county_median_rent_2016;
        let medianRent2017 = countyData[0].county_median_rent_2017;
        let medianRent2018 = countyData[0].county_median_rent_2018;
        let medianRent2019 = countyData[0].county_median_rent_2019;
        let medianIncome = countyData[0].county_median_income;

        // 2019 Median Income 
        let medianIncomeTag = d3.select("#section2").append("h5").text(medianIncome);

        // 2019 Percent of Income
        let percentOfIncome = (medianRent2019 / (medianIncome / 12)) * 100
        let percentIncomeTag = d3.select("#section3").append("h5").text(percentOfIncome)



        let trace1 = {
            x: [2015, 2016, 2017, 2018, 2019],
            y: [medianRent2015, medianRent2016, medianRent2017, medianRent2018, medianRent2019],
            type: 'scatter'
        };
        
        
        let data = [trace1];
        
        let layout = {
            title: countyName,
            xaxis: { title: "Year", tickformat: '.0f', dtick: 1 },
            yaxis: { title: "Average Rent ($)" }
        }

        Plotly.newPlot('plot', data, layout);
    })

}


function countyID() {
    let dropdownMenu = d3.select("#selDataset");
    let id = dropdownMenu.property("value");

    createPlots(id);
}

d3.selectAll("#selDataset").on("change", countyID);

let counties = ['Baker','Benton','Clackamas','Clatsop', 'Columbia',
            'Coos', 'Crook', 'Curry', 'Deschutes', 'Douglas', 'Gilliam', 
            'Grant', 'Harney', 'Hood', 'Jackson', 'Jefferson', 'Josephine',
            'Klamath', 'Lake', 'Lane', 'Lincoln', 'Linn', 'Malheur', 'Marion',
            'Morrow', 'Multnomah', 'Polk', 'Sherman', 'Tillamook', 'Umatilla', 
            'Union', 'Wallowa', 'Wasco', 'Washington', 'Wheeler', 'Yamhill'];
var countyCall =[]

for (let i=0; i < counties.length; i++) {

    countyCall.push(d3.json(`/api/v1/${counties[i]}`))

};

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

Promise.all(countyCall).then(allCounties => {
    var popData = [];
    var incomeData = [];
    var rentData = [];
    var percHomeoweners = [];
    var percRenters = [];
    var newHousing = [];

    allCounties.forEach(countyData => {
        popData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].pop)]);

        incomeData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].county_median_income)]);

        let homeowners = Number(countyData[0].homeowners) / (Number(countyData[0].homeowners) + (Number(countyData[0].renters)));

        percHomeoweners.push([`us-or-${countyData[0].county_fips}`, homeowners]);

        let renters = Number(countyData[0].renters) / (Number(countyData[0].homeowners) + (Number(countyData[0].renters)));

        percRenters.push([`us-or-${countyData[0].county_fips}`, renters]);

        rentData.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].county_median_rent_2019)]);

        newHousing.push([`us-or-${countyData[0].county_fips}`, Number(countyData[0].new_housing)]);
    })
    
    buildMap(popData, "map1", "Population");
    buildMap(incomeData, "map2", "Median Income");
    buildMap(rentData, "map3", "Median Rent");
    buildMap(percRenters, "map4", "Renters as a % of Housholds");
    buildMap(percHomeoweners, "map5", "Homeowners as a % of Housholds");
    buildMap(newHousing, "map6", "New Housing Units Built 2014 or Later");
});



