5-Day/3-Hour Forecast
Provides weather forecast data for the next 5 days with 3-hour intervals.

API URL:
bash
Copy
Edit
https://api.openweathermap.org/data/2.5/forecast?q=CITY_NAME&appid=YOUR_API_KEY
Parameters:
q: City name (e.g., New York).
appid: Your OpenWeather API key.
Optional:
units: Units for temperature. Options: metric (Celsius), imperial (Fahrenheit), or default (Kelvin).
lang: Language for weather descriptions (e.g., en, fr, es).
Example Request:
bash
Copy
Edit
https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=YOUR_API_KEY

api key  2311494df380589310eb6d56646ec070


Using Icons for Weather Conditions
Each forecast response includes an icon code. You can fetch the corresponding weather icon using:

Icon URL:
bash
Copy
Edit
https://openweathermap.org/img/wn/ICON_CODE@2x.png
Example:
If the icon code is 10d, the URL will be:

bash
Copy
Edit
https://openweathermap.org/img/wn/10d@2x.png


npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
http://api.openweathermap.org/data/2.5/air_pollution?lat=28&lon=77&appid=2311494df380589310eb6d56646ec070