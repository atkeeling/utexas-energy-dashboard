import datetime as dt
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request)

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/building_energy_data.sqlite"

db = SQLAlchemy(app)

# user = "postgres"
# password = "changeme"
# host = "localhost"
# port = "5432"
# db = "building_energy_data"
# uri = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"

# database_path = "data/building_energy_data.sqlite"
# engine = create_engine(f"sqlite:///{database_path}")

Base = automap_base()
Base.prepare(db.engine, reflect=True)

Building_info = Base.classes.building_info
Meter_readings = Base.classes.meter_readings
Daily_temp = Base.classes.dailyTemp

# session = Session(engine)



@app.route("/")
def mapPage():
    return render_template("index.html")

@app.route("/building_json")
def building_json():
    lat_lon = db.session.query(Building_info.Acronym, Building_info.Latitude, Building_info.Longitude).all()

    building_lat_lon = []
    for result in lat_lon:
        building_lat_lon.append({
            "acr": result[0],
            "lat": result[1],
            "lon": result[2]
        })
    return jsonify(building_lat_lon)

@app.route("/meter_json/<sel_bldg>")
def meter_json(sel_bldg):
    sel = [
        Meter_readings.DateTime,
        Meter_readings.chw,
        Meter_readings.ele,
        Meter_readings.stm,
        Meter_readings.temp
    ]
    results = db.session.query(*sel).filter(Meter_readings.acr == sel_bldg).all()
    # meter_data = {}
    # for result in results:
    #     meter_data["chw"] = result[0]
    #     meter_data["ele"] = result[1]
    #     meter_data["stm"] = result[2]
    #     meter_data["temp"] = result[3]
    # date = [result[0] for result in results]
    # chw = [result[1] for result in results]
    # ele = [result[2] for result in results]
    # stm = [result[3] for result in results]
    # temp = [result[4] for result in results]
    # meter_data = {
    #     "date": date,
    #     "chw": chw,
    #     "ele": ele,
    #     "stm": stm,
    #     "temp": temp
    # }
    meter_data = []
    for result in results:
        meter_data.append({
            "DateTime": result[0],
            "chw": result[1],
            "ele": result[2],
            "stm": result[3],
            "temp": result[4]
        })

    return jsonify(meter_data)

@app.route("/plots/<sel_bldg>")
def plots(sel_bldg):
    return render_template("plots.html", sel_bldg=sel_bldg)

if __name__ == "__main__":
    app.run()
