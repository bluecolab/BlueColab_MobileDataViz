from shiny.express import input, render, ui
from shinywidgets import render_plotly
from helper_functions import get_years, fetch_data_caller
import plotly.express as px
import calendar, datetime

# Get the name of the last month
@render.text
def slider_val():
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

@render_plotly
def plot1():
    # getting parameters from dropdowns
    parameter = input.parameter()
    location_1 = input.location_1()
    location_2 = input.location_2()
    month_1 = input.month_1()
    month_2 = input.month_2()
    year_1 = input.year_1()
    year_2 = input.year_2()

    df = fetch_data_caller(location_1,year_1,month_1).data

    if location_1 == "Choate Pond":
        full_to_short_names  = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct', 'Salinity': 'Sal','Temperature': 'Temp','Turbidity': 'Turb'}
        p = px.line(df, x='timestamp', y=full_to_short_names[parameter])
        p.update_layout(height=200, xaxis_title=None)
    # TODO: Add support for other water location
        
    # TODO: Add support for second location/time to compare
        
    return p

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
