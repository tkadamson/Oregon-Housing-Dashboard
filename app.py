#Import dependencies and set up flask app
from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
import json
from bson import json_util
from flask_cors import CORS

app = Flask(__name__)

#Connect to MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/housing_data_db"

CORS(app)

mongo = PyMongo(app)

full_dataset = mongo.db.housing_data_db

#First route goes to main project page
@app.route("/")
def index():

    return render_template("index.html")

#Second Route is the API Homepage which explains how to get to all the endpoints
@app.route('/api/v1/home')
def home():

    return render_template("api.html")

@app.route("/api/v1/<county>")

#Third route is the endpoint for the counties
def county_stats(county):
    
    #Get the correct county the user put in
    county_info = list(full_dataset.find({'county': county}))

    return json.dumps(county_info, indent=4, default=json_util.default)

#Fourth route is Oregon only
@app.route("/api/v1/or")
def state_stats():

    #Get only state data
    state_info = list(mongo.db.housing_data_db.find({'data': 'state'}))

    return json.dumps(state_info, indent=4, default=json_util.default)

#Last route is US only
@app.route("/api/v1/us")
def national_stats():
    
    #Get only US data
    us_info = list(mongo.db.housing_data_db.find({'data': 'national'}))

    return json.dumps(us_info, indent=4, default=json_util.default)

if __name__ == "__main__":
    app.run(debug=True)