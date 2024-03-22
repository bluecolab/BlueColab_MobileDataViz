from shiny.express import input, render, ui
from shinywidgets import render_plotly
from helper_functions import get_years, fetch_data_caller
import plotly.express as px
import calendar, datetime
import pandas as pd
import plotly.graph_objects as go

# Noting so we don't forget missing features
# TODO: (later) Add back WQI
# TODO: (later) Add back text that summerized the montly data
# TODO: (later) Add url parameters
# TODO: (overall) Improve the UI 
# TODO: (later) Convert everything to the right units
# TODO: (later) Cleaning data up, removing outliers. Python makes this easier...!

@render.text
def output_text_verbatim():
    """Creates the title above the graph

    Returns:
        str: Title to be set
    """
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

    full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
                           'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb', 'pH': 'pH'}

    df_param_only = df[["timestamp", full_to_short_names[parameter]]]

    if parameter == 'Temperature':
        df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

    df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
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

# kenji's plot
# @render_plotly
# def plot2():
#     """Generates the graph

#     Returns:
#         px: Graph to display
#     """
#     # getting parameters from the dropdowns
#     parameter = input.parameter()
#     location_1 = input.location_1()
#     location_2 = input.location_2()
#     month_1 = input.month_1()
#     month_2 = input.month_2()
#     year_1 = input.year_1()
#     year_2 = input.year_2()

#     df = fetch_data_caller(location_1,year_1,month_1).data
#     # ^ This DataFrame looks like the one in health_dashboard GitHub. Where each parameter was in its own columns

#     # TODO: (Bonus):  
    
#     if location_1 == "Choate Pond":
#         full_to_short_names  = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct', 'Salinity': 'Sal','Temperature': 'Temp','Turbidity': 'Turb'}

#         df_param_only = df[["timestamp",full_to_short_names[parameter]]]
        
#         # Convert the temperures to farienheight
#         if parameter == 'Temperature':
#             df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

#         df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])

#         df_param_only = df_param_only # your code here idk 

#         # TODO: (Bonus): Look at the min_Cond and max_Cond. Draw a tick mark on the graph at that point if it's out of sensor thresholds. 
#         # Tasks:
#         #   - This I honestly don't know. But you got this 

#         p = px.line(df_param_only, x='timestamp', y=full_to_short_names[parameter])
#         p.update_layout(height=200, xaxis_title=None)
 
#     # TODO: (soon) Add support for other water location
        
#     # TODO: (soon) Add support for second location/time to compare
    
#     return p
    


# lizi's plot before
# @render_plotly
# def plot1():
#     # getting parameters from the dropdowns
#     parameter = input.parameter()
#     location_1 = input.location_1()
#     location_2 = input.location_2()
#     month_1 = input.month_1()
#     month_2 = input.month_2()
#     year_1 = input.year_1()
#     year_2 = input.year_2()

#     df = fetch_data_caller(location_1, year_1, month_1).data

#     full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
#                            'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb'}

#     df_param_only = df[["timestamp", full_to_short_names[parameter]]]

#     # If the parameter is Temperature, convert Celsius to Fahrenheit
#     if parameter == 'Temperature':
#         df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

#     # Group by day and calculate min, max, and average
#     df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
#     df_daily_summary = df_param_only.resample('D', on='timestamp').agg(
#         min_value=(full_to_short_names[parameter], 'min'),
#         max_value=(full_to_short_names[parameter], 'max'),
#         avg_value=(full_to_short_names[parameter], 'mean')
#     ).reset_index()

#     if df_daily_summary.empty:
#         # If the DataFrame is empty, return None to prevent plotting
#         return None

#     # Create the plot
#     fig = go.Figure()

#     # Add traces for min, max, and average values based on selected parameter
#     fig.add_trace(go.Scatter(x=df_daily_summary['timestamp'], y=df_daily_summary['max_value'],
#                              mode='lines', name='Max'))
#     fig.add_trace(go.Scatter(x=df_daily_summary['timestamp'], y=df_daily_summary['avg_value'],
#                              mode='lines', name='Average'))
#     fig.add_trace(go.Scatter(x=df_daily_summary['timestamp'], y=df_daily_summary['min_value'],
#                              mode='lines', name='Min'))

#     # Customize layout
#     if parameter == 'Temperature':
#         fig.update_layout(yaxis_title=f'{parameter} (°F)', height=250, xaxis_title=None)
#     else:
#         fig.update_layout(yaxis_title=f'{parameter}', height=250, xaxis_title=None)

#     fig.update_layout(legend=dict(
#         orientation="h",
#         yanchor="bottom",
#         y=1.02,
#         xanchor="right",
#         x=1
#     ))

#     return fig



        # TODO: (before Friday?): We have this DataFrame df_param_only. It has ALL the data of the whole month for the selected parameter. That's like 2976 rows per month?
        # Tasks: 
        #   - Create a new df, so it only 31 rows, one row for each day
        #   - Each row should have the (1) min (2) max (3) average of each day of the month
        #     so the df would look kinda like this. The names of the cols might be different 
        
        #     timestamp   min_Cond max_Cond avg_Cond
        # 0   01-01-2024  22        76       33
        # 1   01-02-2024  54        76       33
        # 2   01-03-2024  22        76       54
        # 3   01-04-2024  22        32       11
        # 3   01-05-2024  34        76       44
        #   Done?
    
        # TODO: (before Friday?): Now that we have the df with min/max/avg working, please make the graph.
        # Tasks:
        #   - Forget, the code we have already. What we want to do is add a ribbon to our graph. Looking up ribbon plotly or something 
        #     may help. Ribbon can be any color that makes sense. 
        #   - Essentially, the min_Cond would serve as the bottom of the ribbon. max the top of the ribbon.
        #   - And avg_Cond just a line graph. 
        #   Done?
        
