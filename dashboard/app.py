# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///data/buildings.sqlite"

db = SQLAlchemy(app)

@app.route("/")
def mapPage():
    return render_template("index.html")

@app.route("/plots/<acronym>")
def plots(acronym):
    return render_template("plots.html", acronym=acronym)

@app.route("/meter_json/<acronym>")
def meter_json(acronym):
    # query sql database with sqlalchmey
#     results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

    # filter by acronym 

    # return jsonified data as API request from d3
    return jsonify(data)

# def pals():
#     results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

#     hover_text = [result[0] for result in results]
#     lat = [result[1] for result in results]
#     lon = [result[2] for result in results]

#     pet_data = [{
#         "type": "scattergeo",
#         "locationmode": "USA-states",
#         "lat": lat,
#         "lon": lon,
#         "text": hover_text,
#         "hoverinfo": "text",
#         "marker": {
#             "size": 50,
#             "line": {
#                 "color": "rgb(8,8,8)",
#                 "width": 1
#             },
#         }
#     }]

#     return jsonify(pet_data)


if __name__ == "__main__":
    app.run()
