# Health Checks

A simple Python Script that will test all the Hudson River locations we use. The script should generate a PDF for each location with information on health of each station and their data.

Error conditions:

- If there is low variability of data (i.e. same value for 30 days)
- If the last data point from the API is more then 3 days old

Actions needed:

- Wait for USGS to fix the station (ignore the problem and let app error handling to take care of it)
- Remove the location from the app
