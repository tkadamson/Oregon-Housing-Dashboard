// Set Baker County as initial load
let countyName = "Baker"

//*************************************************************************************
//LINE GRAPH OF MEDIAN RENTS

// Call on createPlots function
createPlots(countyName);


function createPlots(countyName) {

    // Call in Oregon data from API
    d3.json(`/api/v1/or`).then(function (orData){
        // console.log(orData)

        // Assign Oregon data to variables
        let orRent2015 = orData[0].state_median_rent_2015;
        let orRent2016 = orData[0].state_median_rent_2016;
        let orRent2017 = orData[0].state_median_rent_2017;
        let orRent2018 = orData[0].state_median_rent_2018;
        let orRent2019 = orData[0].state_median_rent_2019;
    
    // Call in US data from API
    d3.json(`api/v1/us`).then(function (usData) {
        // console.log(usData);
        
        // Assign US data to variables
        let usRent2015 = usData[0].us_median_rent_2015;
        let usRent2016 = usData[0].us_median_rent_2016;
        let usRent2017 = usData[0].us_median_rent_2017;
        let usRent2018 = usData[0].us_median_rent_2018;
        let usRent2019 = usData[0].us_median_rent_2019;

    // Call in county data from API
    d3.json(`api/v1/${countyName}`).then(function (countyData) {
        // console.log(countyData);

        // Assign county data to variables
        let countyName = countyData[0].county;
        let medianRent2015 = countyData[0].county_median_rent_2015;
        let medianRent2016 = countyData[0].county_median_rent_2016;
        let medianRent2017 = countyData[0].county_median_rent_2017;
        let medianRent2018 = countyData[0].county_median_rent_2018;
        let medianRent2019 = countyData[0].county_median_rent_2019;
        let medianIncome = countyData[0].county_median_income;
        let renters = countyData[0].renters
        let homeowners = countyData[0].homeowners

        // Grab income tag and assign 2019 median income 
        d3.select("#income").html("");
        d3.select("#income").append("h5").text("$" + medianIncome);
        
        // Grab rent tag and assign 2019 percent of income
        let percentOfIncome = (medianRent2019 / (medianIncome / 12)) * 100
        let percentOfIncomeFloat = parseFloat(percentOfIncome).toFixed(2);
        d3.select("#rent").html("");
        d3.select("#rent").append("h5").text(percentOfIncomeFloat + "%");

        // Create trace for county rental data
        let trace1 = {
            x: [2015, 2016, 2017, 2018, 2019],
            y: [medianRent2015, medianRent2016, medianRent2017, medianRent2018, medianRent2019],
            name: 'County Median Rent',
            type: 'scatter'
        };

        // Create trace for US rental data
        let trace2 = {
            x: [2015, 2016, 2017, 2018, 2019],
            y: [usRent2015, usRent2016, usRent2017, usRent2018, usRent2019],
            name: 'US Median Rent', 
            type: 'scatter'
        };

        // Create trace for Oregon rental data
        let trace3 = {
            x: [2015, 2016, 2017, 2018, 2019],
            y: [orRent2015, orRent2016, orRent2017, orRent2018, orRent2019],
            name: 'Oregon Median Rent',
            type: 'scatter'
        };

        // Pull in all three traces 
        let data1 = [trace1, trace2, trace3];

        // Add labels to graph
        let layout = {
            title: countyName,
            xaxis: { title: "Year", tickformat: '.0f', dtick: 1 },
            yaxis: { title: "Average Rent ($)" }
        }

        // Create graph
        Plotly.newPlot('plot', data1, layout);

//*************************************************************************************
//PIE CHART HOMEOWNERS VS RENTERS

        //Define area for pie chart
        var width = 450;
        var height = 450;
        var margin = 40;

        var radius = Math.min(width, height) / 2 - margin;
        d3.select("#pie").html("")

        //Apend the circle to the pie id
        var svg = d3.select("#pie")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        //Load in the data for renters and homeowners
        var plotData = { "Renters": renters, "Homeowners": homeowners };

        //Build the pie chart with the above data
        var pie = d3.pie()
            .value(function (d) { return d.value; });
        var data_ready = pie(d3.entries(plotData));
        var color = d3.scaleOrdinal()
            .domain(plotData)
            .range(d3.schemeSet2);

        svg
            .selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function (d) { return d.data.key + " " + d.data.value })
            .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 17);
    })
    })
    })

}

//Function to get the new county when the user selects a new county
function countyID() {
    let dropdownMenu = d3.select("#selDataset");
    let id = dropdownMenu.property("value");

    createPlots(id);
}

//Event listener on dropdown
d3.selectAll("#selDataset").on("change", countyID);


//*************************************************************************************
//CHOROPLETH MAPS OF VARIOUS METRICS

let counties = ['Baker', 'Benton', 'Clackamas', 'Clatsop', 'Columbia',
    'Coos', 'Crook', 'Curry', 'Deschutes', 'Douglas', 'Gilliam',
    'Grant', 'Harney', 'Hood', 'Jackson', 'Jefferson', 'Josephine',
    'Klamath', 'Lake', 'Lane', 'Lincoln', 'Linn', 'Malheur', 'Marion',
    'Morrow', 'Multnomah', 'Polk', 'Sherman', 'Tillamook', 'Umatilla',
    'Union', 'Wallowa', 'Wasco', 'Washington', 'Wheeler', 'Yamhill'];

//countyCall will be populated with the api endpoint for each county
var countyCall = []

for (let i = 0; i < counties.length; i++) {

    countyCall.push(d3.json(`/api/v1/${counties[i]}`))

};

function buildMap(metric, div, label) {
    //getJSON grabs the specific map we want to use
    Highcharts.getJSON("https://code.highcharts.com/mapdata/countries/us/us-or-all.geo.json",
        function (geojson) {

            //console.log(geojson);

            Highcharts.mapChart(div, {
                //Define map
                chart: {
                    map: geojson
                },

                //Add map title
                title: {
                    text: label
                },

                //Lower bar
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                colorAxis: {
                    tickPixelInterval: 100
                },
                
                //This is where the data is loaded in to match on county codes
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

//Promise.all() catches all the endpoints

Promise.all(countyCall).then(allCounties => {

    //Declare variable arrays to store specific map data
    var popData = [];
    var incomeData = [];
    var rentData = [];
    var percHomeoweners = [];
    var percRenters = [];
    var newHousing = [];

    //For every county in countyCall, get county code ('us-or-countyfips) and the info we want
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

    //Call buildMap for every one to display
    buildMap(popData, "map1", "Population");
    buildMap(incomeData, "map2", "Median Income");
    buildMap(rentData, "map3", "Median Rent");
    buildMap(percRenters, "map4", "Renters as a % of Households");
    buildMap(percHomeoweners, "map5", "Homeowners as a % of Housholds");
    buildMap(newHousing, "map6", "New Housing Units Built 2014 or Later");
});



