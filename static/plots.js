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



