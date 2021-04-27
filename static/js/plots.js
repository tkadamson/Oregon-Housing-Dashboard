var width = 450;
var height = 450;
var margin = 40;

var radius = Math.min(width, height) / 2 - margin;

var svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// d3.json('http://127.0.0.1:5000/api/v1/Washington').then(countyData => {

//     console.log(countryData);

//     let countyName = countyData[0].county;

//     let countyRenters = countyData.renters;
//     let countyOwners = countyData.homeowners;
//     console.log(countyRenters);


// });
var data = { "Renters": 6, "Homeowners": 4 };

var pie = d3.pie()
    .value(function (d) { return d.value; });
var data_ready = pie(d3.entries(data));
var color = d3.scaleOrdinal()
    .domain(data)
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