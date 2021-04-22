from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
import json
from bson import json_util

app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/housing_data_db")

@app.route('/')
def home():

    return(
        "Available Routes:<br>"
        "/or => median rent data by state<br>"
        "/us => median rent data nationally <br>"
        "/<county> => full census dataset by county"
        )


@app.route("/<county>")
def county_stats(county):
    
    county_info = list(mongo.db.housing_data_db.find({'county': county}))

    return json.dumps(county_info, indent=4, default=json_util.default)

@app.route("/or")
def state_stats():

    state_info = list(mongo.db.housing_data_db.find({'data': 'state'}))

    return json.dumps(state_info, indent=4, default=json_util.default)

@app.route("/us")
def national_stats():
    us_info = list(mongo.db.housing_data_db.find({'data': 'national'}))

    return json.dumps(us_info, indent=4, default=json_util.default)

if __name__ == "__main__":
    app.run(debug=True)