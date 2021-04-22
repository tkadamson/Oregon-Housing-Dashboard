from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
import json
from bson import json_util

app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/housing_data_db")

@app.route('/')
def home():

    housing_info = list(mongo.db.housing_data_db.find({'data': 'state'}))

    return json.dumps(housing_info, indent=4, default=json_util.default)

if __name__ == "__main__":
    app.run(debug=True)