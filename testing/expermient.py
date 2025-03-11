import requests
from datetime import datetime
from dateutil import parser

def get_last(site_id):
    response = requests.get(f"https://waterservices.usgs.gov/nwis/iv/?sites={site_id}&format=json")
    data = response.json()
    timeseries = data['value']['timeSeries']
    location = data['value']['timeSeries'][0]['sourceInfo']['siteName']
    print(location+" ("+site_id+")")

    for param in timeseries:
        variableCodes = param['variable']['variableCode']
        code = ""
        for variableCode in variableCodes:
            code = code +  variableCode['value'] + " "
        unit = param['variable']['unit']['unitCode']
        name = param['variable']['variableName']

        # print(name)
        values = param['values']

        line = ''
        for value in values:
            for val in value['value']:
                # Convert string to datetime object
                timestamp = parser.isoparse(val['dateTime'])

                # Get current time in the same timezone (if needed)
                current_time = datetime.now(timestamp.tzinfo)

                # Calculate the difference between current time and given timestamp
                time_diff = current_time - timestamp

                # Get the difference in minutes
                minutes_ago = time_diff.total_seconds() / 60
                if (val['qualifiers'][0] != "A"):
                    line = line + val['value'] + " " + val['qualifiers'][0] + " " + val['dateTime'] + " "+str(round(minutes_ago))+"  minutes ago"+ "\n\t\t"

        print("\t"+code+" "+name+" ("+unit+")")
        print(f"\t\t{line}")


locations = ["01376520", "01376269", "01374019", "01372043","01359165","0135749950","04213500","01302020","01303152","01304200","01304200","01304562","01304650","01310740","01311143","01354230","01433500","04213500","04231600","431314077315901","431533076582101"]

for ele in locations:
    get_last(ele)