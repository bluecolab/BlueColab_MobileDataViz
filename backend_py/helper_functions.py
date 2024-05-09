import datetime
from data_fetch import fetch_data_caller
import plotly.graph_objects as go

def get_years(**kwargs):
    """Returns a list containing years from current year to 2021. For the dropdowns.

    ### Keyword Arguments:
        show_na (bool, optional): If True, appends "NA" to the list. Defaults to False.

    ### Returns:
        list: A list containing years from current year to 2021. If show_na is True, "NA" is appended to the list.

    ### Example:
        >>> get_years()
        [current year, ..., 2023, 2022, 2021]  # List of years from the current year back to 2021
        >>> get_years(show_na=True)
        ['NA', current year, ..., 2023, 2022, 2021]  # List of years from the current year back to 2021 with "NA" appended
    """

    show_na = kwargs.get('show_na')

    years_list = [year for year in range(datetime.datetime.now().year, 2020, -1)]
    if show_na: 
        years_list.insert(0,"NA")
        return years_list
    else:
        return years_list
    
def create_empty_plot():
    # Create an empty Plotly figure
    fig = go.Figure()
    return fig


# oh yeah, it would be nice to have comments too
# chatgpt is a good friend 
def generate_line_graph(parameter, location, month, year):

    return "the graph"
