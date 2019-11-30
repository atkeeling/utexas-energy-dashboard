
from flask import (
    Flask,
    render_template,
    jsonify,
    request)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/building_energy_data.sqlite"

db = SQLAlchemy(app)

# from sqlalchemy import create_engine
# user = "postgres"
# password = "changeme"
# host = "localhost"
# port = "5432"
# db = "building_energy_data"
# uri = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"
# engine = create_engine(uri)

@app.route("/")
def mapPage():
    return render_template("index.html")

@app.route("/plots/<acronym>")
def plots(acronym):
    return render_template("plots.html", acronym=acronym)

@app.route("/meter_json/<acronym>")
def meter_json(acronym):
    results = db.session.query(meter_readings.chw, meter_readings.ele, meter_readings.stm).filter(meter_readings.acr=="acronym").all()

    chw = [result[0] for result in results]
    ele = [result[1] for result in results]
    stm = [result[2] for result in results]
    temp = [result[3] for result in results]
    meter_data = {
        "chw": chw,
        "ele": ele,
        "stm": stm,
        "temp": temp
    }

    # return jsonified data as API request from d3
    return jsonify(meter_data)

if __name__ == "__main__":
    app.run()
