import datetime
import pandas as pd
from pandas import DataFrame
import calendar, datetime
from WaterData import WaterData
import dataretrieval.nwis as nwis

def usgs_data_fetch(location: str | None = None, 
                    start_year: int | None = None,
                    start_month: int |  None = None,
                    start_day: int |  None = None,
                    end_year: int | None = None,
                    end_month: int | None = None,
                    end_day: int | None = None) -> DataFrame:
    """Fetching data for USGS water location data, from Yonkers, Poughkeepsie, and West Point.

    Args:
        location (str | None): Hudson river locations by name. Defaults to None.
        start_year (int): Year to start getting data from.
        start_month (int): Month to start getting data from.
        start_day (int): Day to start getting from. 
        end_year (int): Year to end getting data from.
        end_month (int): Month to end getting data from.
        end_day (int): Day to end getting from. 

    Returns:
        DataFrame: Data fetched from the specified location for the given dates.
    """

    if any(param is None for param in [location, start_year, start_month, start_day, end_year, end_month, end_day]):
        raise ValueError("All parameters must be provided")

    sites_dict = {'West Point' : '01374019', 'Yonkers' : '01376307', 'Poughkeepsie' : '01372043'}
    site = sites_dict.get(location)

    df = nwis.get_record(sites=site, service='iv', start=f'{start_year}-{start_month}-{start_day}', end=f'{end_year}-{end_month}-{end_day}')
    
    # columns_to_keep = [col for col in df.columns if not col.endswith('_cd')]
    df = df.reset_index()
    location_mapping = {
        '01374019' : {
            '00010_hrecos': 'Temp',
            '00095_hrecos': 'Cond',
            '00300_hrecos': 'DOpct',
            '90860_hrecos': 'Sal',
            '00400_hrecos': 'pH',
            '63680_surface': 'Turb',
            'datetime' : 'timestamp'
        },
        '01372043' : {
            '00010_surface' : 'Temp',
            '00095_surface' : 'Cond',
            '00300_surface': 'DOpct',
            '90860_surface, [hrecos (near surface': 'Sal',
            '00400_surface': 'pH',
            '63680_hrecos exo': 'Turb',
            'datetime' : 'timestamp'
        },
        '01376307' : {
            '00010_hrecos': 'Temp',
            '00095_hrecos': 'Cond',
            '00300_hrecos': 'DOpct',
            '90860_hrecos': 'Sal',
            '00400_hrecos': 'pH',
            '63680_surface': 'Turb',
            'datetime' : 'timestamp'
        }, 
    }
    
    # Rename columns using the dictionary
    df_renamed = df.rename(columns=location_mapping.get(site))

    return df_renamed

def blue_colab_data_fetch(start_year: int | None = None,
                          start_month: int |  None = None,
                          start_day: int |  None = None,
                          end_year: int | None = None,
                          end_month: int | None = None,
                          end_day: int | None = None) -> DataFrame:
    """Get's Blue CoLab API Water Data from Alan

    Args:
        start_year (int): Year to start getting data from. Defaults to None.
        start_month (int): Month to start getting data from. Defaults to None.
        start_day (int): Day to start getting from. Defaults to None.
        end_year (int): Year to end getting data from. Defaults to None.
        end_month (int): Month to end getting data from. Defaults to None.
        end_day (int): Day to end getting from. Defaults to None.

    Returns:
        DataFrame: DataFrame with data from the Blue CoLab API.
    """

    if any(param is None for param in [start_year, start_month, start_day, end_year, end_month, end_day]):
        raise ValueError("All parameters must be provided")

    # we create the link for the Blue CoLab API
    url = f"https://colabprod01.pace.edu/api/influx/sensordata/Alan/idk/range?stream=false&start_date={start_year}-{start_month}-{start_day}T00%3A00%3A00%2B00%3A00&stop_date={end_year}-{end_month}-{end_day}T23%3A59%3A59%2B00%3A00"
    print(url)
    # Get the data
    df = pd.read_json(url)

    # Normalize, that is move the data in sensor dict such that they are in a column of the DataFrame
    df_normalized = pd.concat([df.drop(['sensors'], axis=1), df['sensors'].apply(pd.Series)], axis=1)

    return df_normalized

def fetch_data(location: str | None = "Choate Pond",
               start_year: int | None = None,
               start_month: int |  None = None,
               start_day: int |  None = None,
               end_year: int | None = None,
               end_month: int | None = None,
               end_day: int | None = None) -> DataFrame:
    """Fetches data from APIs.

    ### Args:
        location (str): Location to get water data from. Default is "Choate Pond".
        start_year (int): Year to start getting data from.
        start_month (int): Month to start getting data from.
        start_day (int): Day to start getting from. 
        end_year (int): Year to end getting data from.
        end_month (int): Month to end getting data from.
        end_day (int): Day to end getting from. 
    ### Returns:
        DataFrame: Data fetched from the specified location for the given dates.

    ### Raises:
        ValueError: If any of the date parameters are not know, will raise a value error.
    """
    if any(param is None for param in [start_year, start_month, start_day, end_year, end_month, end_day]):
        raise ValueError("All parameters must be provided")
    
    if location == "Choate Pond":
        data = blue_colab_data_fetch(start_year,start_month,start_day,end_year,end_month,end_day)

        doptc_value = sum(data['DOpct'])/len(data['DOpct'])
        ph_value = sum(data['pH'])/len(data['pH'])
        temp_value = sum(data['Temp'] * 9/5 + 32)/len(data['Temp'])
        cond_value = sum(data['Cond'])/len(data['Cond'])
        turb_value = sum(data['Turb'])/len(data['Turb'])
        
        def calculate_wqi(doptc: float, ph: float, temp: float, cond: float, turb: float) -> float:
                # Constants
                const_doptc = 0.34
                const_ph = 0.22
                const_temp = 0.2
                const_cond = 0.08
                const_turb = 0.16
                # Calculate WQI
                return (doptc * const_doptc) + (ph * const_ph) + (temp * const_temp) + (cond * const_cond) + (turb * const_turb)
                
        # Calculate WQI for each set of values
        wqi = calculate_wqi(doptc_value, ph_value, temp_value, cond_value, turb_value)

        return WaterData(data, wqi)
    else:
        return None


def fetch_data_caller(location: str | None = "Choate Pond",
                      year: int | None = None,
                      month: int | None = None) -> DataFrame:
    """Helper function to get monthly water data given location, month, and year as a DataFrame

    ### Args:
        location (str): Location to get water data from. Default is "Choate Pond".
        year (int): Year to get water data from.
        month (int): Month to get water data from as a month name.

    ### Returns:
        DataFrame: Data fetched from the specified location for the given month and year.

    ### Raises:
        ValueError: If `year` or `month` is `None`.
    """
    
    if year is None or month is None:
        raise ValueError("year and month must be sent as parameters")

    start_year = year 
    start_month = datetime.datetime.strptime(month, "%B").month # converts month name to month number
    start_day = "1"
    end_year = year 
    end_month = datetime.datetime.strptime(month, "%B").month  # converts month name to month number
    end_day = calendar.monthrange(int(year), datetime.datetime.strptime(month, "%B").month)[1] # find the last day of the month in given year

    return fetch_data(location,start_year,start_month,start_day,end_year,end_month,end_day)
