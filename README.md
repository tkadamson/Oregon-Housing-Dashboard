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


### Visulaizations Page (With Javascript)
