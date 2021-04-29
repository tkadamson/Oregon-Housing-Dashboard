# Oregon-Housing-Dashboard

## Summary
This project tracks various housing social metrics across the state of Oregon including the ratio of renters to homeowners, county median rent costs in relation to the state and national means, and where new housing is being built. All data comes from the American Community Survey years 2014-2019.

## To Run Repository Locally
First use project2.yml to create a new environment with the required Python modules (see instructions here: https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#saving-environment-variables).

If necessary, download and install MongoDB. Instructions here: https://www.mongodb.com/

Run census_cleaning.ipynb ONCE to extract the data from the ACS API and load it into your local MongoDB. Then run app.py in your preferred IDE or from the Command Line.

## Project Details

This project is divided into three distinct sections:
* American Community Survey ETL
* Flask App API with ETL'd data
* Visualizations webpage, and javascript file for interactivity

### American Community Survey ETL
When determining metrics to explore in the dashboard, we looked through the ACS documentation see what was available and what would be relevant. Once we found our metrics, we also had to find their census codes to access them in the Census API. Those codes and metrics were as follows:

* NAME = County Name
* B01003_001E = County Population
* B07013_002E = Homeowner Estimate
* B07013_003E = Renter Estimate
* B25064_001E = Median Rent
* B19013_001E = Median Income
* B25063_001E = New Housing Stock (built 2014 or later)

For median rent we chose to find not only the 2019 data but the five years previous and also find not just county data but data for the US and Oregon.

Given these metrics, we needed the 2019 data for each county at each metric, and median rent data at each geographic level for each year. To loop through each county, we generated a list of county fips, which are odd numbers from 001 to 071. Then using those fips, we called the Census API in a loop for each county fips. From there we first used 2019 to grab all the metrics we needed, then went back through the previous years to grab median rent. Once all the data was stored invariables, we put them in a dictionary and loaded them into MongoDB by county. 

Similarly, for both the Oregon and US data, we used API calls to get the 2014-2019 median rents, and uploaded them to MongoDB as a separate state and national record. 

### Flask App API
After all the data was loaded into MongoDB, we built a Flask app to display each record in a unique route. The home route contained a redirect for the project main page (see detailed explanation below) and the api/v1/home route displayed a page on how to use the API as well as links to each endpoint. 

After these landing pages, we built one route to the US data, one route to Oregon data, and a county route that took the county in the url and used that to call the selected county's record. Each page displayed the MongoDB record in jsonified format so that we could later call the data into our javascript file (see below)

### Visulaizations Page (With Javascript)
Finally, using our local API, we were ready to build out various visualizations in the index.html file, which displayed at the home route of the Flask app.

Index.html used bootstrap as the base layout, while also pulling in custom CSS for managing our visulazation divs. First, we added a description and a dropdown menu containing each county. That dropdown would then be used to dynamically update two of the visualizations. 

The rest of index.html contained the divs for each element we would pull in from plots.js. Plots.js is divided into three main pieces: creating the line graph of median rents over time using Plotly; building a pie chart of homeowners vs renters using d3; and building several comparative maps using Highcharts.

First we set the county name to be set to Baker (first in alphabetical order) to display on page load. createPlots() took the county name and used it to dynamically update the line and pie charts. 

To build the line chart, our API was called for the Oregon data, the US data, and then the county data from the specified county. We used this data to calculate the median percent oof income spent on rent and then appended that metric and median income to the page. Then, using the full dataset, we created three Plotly traces (US, OR, and County) and placed them in the line graph.

For the pie chart, we fisrt defined the area for the div as wellas calculated the radius of the circle. The data for renters and homeowners was grabbed from the API, an then used to build the pie chartusing d3.pie(). This included specifying the angle of the pie chart with d3,.arc(), and setting the color and the labels. 

An event listener was added after this function to determine when the user made a change to the dropdown and then called createPlots() to dynamically update the plots based on the selected county. 

For the maps, the first thing to do was create an array of the API calls for all 36 counties. Using thise, we created a Promise.all() to ensure that all the data was caught before moving forward. Before the Promise.all(), the buildMap function took the array of the data metric we were building for, which div to place the map in, and a label variable for the title and the tooltips. The function used Highcharts to call a specific map (the Oregon counties map) and then used the data array to join on the county code to shade each county appropriately. 

Inside the Promise.all(), we declared an empty array for each different metric. Then using a forEach on the county, we appended each data point in order, incluidng the highcharts key (us-or-countyfips) along with the appropriate metric for the aray. This generated six arrays to pass into six different maps. Finally, buildMap was called for each of the six metrics, and given the appropriate div and label. 

