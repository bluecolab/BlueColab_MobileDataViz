class WaterData:
  """This is a simple Python class so the fetch_data function 
     returns both data (data frame) and WQI (if applicable)
  """
  def __init__(self, data, wqi):
    self.data = data
    self.wqi = wqi