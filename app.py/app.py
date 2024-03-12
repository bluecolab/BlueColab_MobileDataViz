import pandas as pd  # For data manipulation (similar to dplyr)
import numpy as np   # For numerical operations
import matplotlib.pyplot as plt  # For plotting (similar to ggplot2)
from datetime import datetime  # For date manipulation (similar to lubridate)
from urllib.request import urlopen  # For URL handling (similar to jsonlite)
import json  # For JSON manipulation (similar to jsonlite)
import requests
from scipy.signal import medfilt
from shiny import render, ui
from shiny.express import input
import plotly.express as px
from shiny.express import input, render, ui
from shinywidgets import render_widget
import plotly.graph_objects as go
from urllib.parse import parse_qs, urlparse

app = from shiny import App, reactive, render, req, ui

app_ui = ui.page_fluid(
    ui.input_slider("n", "N", 0, 100, 20),
    ui.output_text_verbatim("txt"),
)


def server(input, output, session):
    @render.text
    def txt():
        return f"n*2 is {input.n() * 2}"


app = App(app_ui, server)

app.layout = html.Div(
    style={"backgroundColor": "white"},
    children=[
        html.H1(
            children="Monthly Water Report",
            style={"textAlign": "center", "color": "white"},
        ),
        dcc.Graph(id="distPlot"),
        html.Div(
            className="row",
            children=[
                html.Div(
                    className="six columns",
                    children=[
                        dcc.Dropdown(
                            id="first",
                            options=[
                                {"label": "Conductivity", "value": "Conductivity"},
                                {"label": "Dissolved Oxygen", "value": "Dissolved Oxygen"},
                                {"label": "Salinity", "value": "Salinity"},
                                {"label": "Temperature", "value": "Temperature"},
                                {"label": "Turbidity", "value": "Turbidity"},
                                {"label": "pH", "value": "pH"},
                            ],
                            placeholder="Choose a dataset",
                            style={"width": "100%"},
                        ),
                        dcc.Graph(id="firstGauge", style={"height": "175px"}),
                    ],
                ),
                html.Div(
                    className="six columns",
                    children=[
                        dcc.Dropdown(
                            id="second",
                            options=[
                                {"label": "Conductivity", "value": "Conductivity"},
                                {"label": "Dissolved Oxygen", "value": "Dissolved Oxygen"},
                                {"label": "Salinity", "value": "Salinity"},
                                {"label": "Temperature", "value": "Temperature"},
                                {"label": "Turbidity", "value": "Turbidity"},
                                {"label": "pH", "value": "pH"},
                            ],
                            placeholder="Choose a dataset",
                            style={"width": "100%"},
                        ),
                        dcc.Graph(id="secondGauge", style={"height": "175px"}),
                    ],
                ),
            ],
        ),
        dcc.Dropdown(
            id="dataset",
            options=[
                {"label": "Conductivity", "value": "Conductivity"},
                {"label": "Dissolved Oxygen", "value": "Dissolved Oxygen"},
                {"label": "Salinity", "value": "Salinity"},
                {"label": "Temperature", "value": "Temperature"},
                {"label": "Turbidity", "value": "Turbidity"},
                {"label": "pH", "value": "pH"},
            ],
            placeholder="Choose a dataset",
            style={"width": "100%"},
        ),
        html.Div(
            className="row",
            children=[
                html.Div(
                    className="six columns",
                    children=[
                        dcc.Dropdown(
                            id="location",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "Choate Pond", "value": "Choate Pond"},
                                {"label": "Yonkers (01376307)", "value": "Yonkers (01376307)"},
                                {"label": "West Point (01374019)", "value": "West Point (01374019)"},
                                {"label": "Poughkeepsie (01372043)", "value": "Poughkeepsie (01372043)"},
                            ],
                            placeholder="Choose a Location",
                            style={"width": "100%"},
                        ),
                        dcc.Dropdown(
                            id="firstYear",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "2023", "value": "2023"},
                                {"label": "2022", "value": "2022"},
                                {"label": "2021", "value": "2021"},
                            ],
                            placeholder="Choose a Start Year",
                            style={"width": "100%"},
                        ),
                        dcc.Dropdown(
                            id="firstMonth",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "January", "value": "January"},
                                {"label": "February", "value": "February"},
                                {"label": "March", "value": "March"},
                                {"label": "April", "value": "April"},
                                {"label": "May", "value": "May"},
                                {"label": "June", "value": "June"},
                                {"label": "July", "value": "July"},
                                {"label": "August", "value": "August"},
                                {"label": "September", "value": "September"},
                                {"label": "October", "value": "October"},
                                {"label": "November", "value": "November"},
                                {"label": "December", "value": "December"},
                            ],
                            placeholder="Choose a Start Month",
                            style={"width": "100%"},
                        ),
                    ],
                ),
                html.Div(
                    className="six columns",
                    children=[
                        dcc.Dropdown(
                            id="secondLocation",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "Choate Pond", "value": "Choate Pond"},
                                {"label": "Yonkers (01376307)", "value": "Yonkers (01376307)"},
                                {"label": "West Point (01374019)", "value": "West Point (01374019)"},
                                {"label": "Poughkeepsie (01372043)", "value": "Poughkeepsie (01372043)"},
                            ],
                            placeholder="Choose a Location",
                            style={"width": "100%"},
                        ),
                        dcc.Dropdown(
                            id="secondYear",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "2023", "value": "2023"},
                                {"label": "2022", "value": "2022"},
                                {"label": "2021", "value": "2021"},
                            ],
                            placeholder="Choose an End Year",
                            style={"width": "100%"},
                        ),
                        dcc.Dropdown(
                            id="secondMonth",
                            options=[
                                {"label": "NA", "value": "NA"},
                                {"label": "January", "value": "January"},
                                {"label": "February", "value": "February"},
                                {"label": "March", "value": "March"},
                                {"label": "April", "value": "April"},
                                {"label": "May", "value": "May"},
                                {"label": "June", "value": "June"},
                                {"label": "July", "value": "July"},
                                {"label": "August", "value": "August"},
                                {"label": "September", "value": "September"},
                                {"label": "October", "value": "October"},
                                {"label": "November", "value": "November"},
                                {"label": "December", "value": "December"},
                            ],
                            placeholder="Choose an End Month",
                            style={"width": "100%"},
                        ),
                    ],
                ),
            ],
        ),
    ],
)

@app.callback(Output("distPlot", "figure"), [Input("dataset", "value")])
def update_distplot(dataset):
    # code to update the plotly figure based on the selected dataset
    pass



if __name__ == "__main__":
    app.run_server(debug=True)



