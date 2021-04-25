d3.json('/api/v1/Washington').then(countyData => {
    console.log(countyData)

    county_fips = countyData[0].county_fips;
    console.log(county_fips);

})