from shiny.express import input, render, ui, session
from urllib.parse import urlparse, parse_qs
from shinywidgets import render_plotly
from data_fetch import fetch_data_caller
from helper_functions import get_years
import calendar, datetime
import pandas as pd
import plotly.graph_objects as go

@render.text
def output_text_verbatim():
    """Creates the title above the graph

    Returns:
        str: Title to be set
    """
    # print(input[".clientdata_url_search"]())
    # search = urlparse(session.input[".clientdata_url_search"]())
    # query_params = parse_qs(search.query)
    # print( query_params.defaultLocation )
    parameter = input.parameter()
    location_1 = input.location_1()
    location_2 = input.location_2()
    month_1 = input.month_1()
    month_2 = input.month_2()
    year_1 = input.year_1()
    year_2 = input.year_2()

    if (location_2 != "NA" and month_2!="NA" and year_2!="NA" ):
        return f"{parameter} data for {location_1} in {month_1} {year_1} and  {location_2} in {month_2} {year_2}"
    else:
        return f"{parameter} data for {location_1} in {month_1} {year_1}"

# mix, avg and min for parameters with shades
# units with parameters

@render_plotly
def plot1():
    parameter = input.parameter()
    location_1 = input.location_1()
    location_2 = input.location_2()
    month_1 = input.month_1()
    month_2 = input.month_2()
    year_1 = input.year_1()
    year_2 = input.year_2()

    df = fetch_data_caller(location_1, year_1, month_1).data
    wqi = fetch_data_caller(location_1, year_1, month_1).wqi

    full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
                           'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb', 'pH': 'pH'}
    print(df.columns)
    df_param_only = df[["timestamp", full_to_short_names[parameter]]]

    if parameter == 'Temperature':
        df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

    df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
    # print(df_param_only)
    df_daily_summary = df_param_only.resample('D', on='timestamp').agg(
        min_value=(full_to_short_names[parameter], 'min'),
        max_value=(full_to_short_names[parameter], 'max'),
        avg_value=(full_to_short_names[parameter], 'mean')
    ).reset_index()

    if df_daily_summary.empty:
        return None

    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=df_daily_summary['timestamp'].tolist() + df_daily_summary['timestamp'].tolist()[::-1],
        y=df_daily_summary['max_value'].tolist() + df_daily_summary['min_value'].tolist()[::-1],
        fill='toself',
        fillcolor='rgba(0, 0, 255, 0.3)',
        line=dict(color='rgba(0, 0, 255, 0)')
    ))

    fig.add_trace(go.Scatter(
        x=df_daily_summary['timestamp'],
        y=df_daily_summary['avg_value'],
        mode='lines',
        line=dict(color='blue')
    ))

    y_axis_title = {
        'Conductivity': 'Conductivity  (mS/cm)',
        'Dissolved Oxygen': 'Dissolved Oxygen  (%)',
        'Salinity': 'Salinity  (ppt)',
        'Temperature': 'Temperature  (°F)',
        'Turbidity': 'Turbidity  (NTU)',
        'pH': 'pH'
    }

    fig.update_layout(yaxis_title=y_axis_title[parameter], height=250, xaxis_title=None, showlegend=False)

    return fig

# Creation of down drop to get the water parameters
ui.input_selectize(
    "parameter", "Select parameter:",
    choices=["Conductivity", "Dissolved Oxygen","Salinity","Temperature","Turbidity","pH"]
)

# Creation of dropdowns to get current years
# Get locations
with ui.layout_columns():
    ui.input_select("location_1", "Location 1", choices=["Choate Pond", "Yonkers","West Point","Poughkeepsie"], width="100%")
    ui.input_select("location_2", "Location 2", choices=["NA","Choate Pond", "Yonkers","West Point","Poughkeepsie"], width="100%")

# Get month, by default the first drop down is set to the last month
with ui.layout_columns():
    ui.input_select("month_1", "Month 1", choices=["January", "February","March","April","May","June","July","August","September","October","November","December"], width="100%",selected=calendar.month_name[datetime.datetime.now().month - 1 if datetime.datetime.now().month > 1 else 12])
    ui.input_select("month_2", "Month 2", choices=["NA","January", "February","March","April","May","June","July","August","September","October","November","December"], width="100%")

# Get year, by default the first drop down is set to the last month's year
with ui.layout_columns():
    ui.input_select("year_1", "Year 1", choices=get_years(), width="100%", selected=datetime.datetime.now().year if datetime.datetime.now().month > 1 else datetime.datetime.now().year - 1)
    ui.input_select("year_2", "Year 2", choices=get_years(show_na=True), width="100%")
