# Purpose
This is a serverless framework application that will create an S3 bucket, dynamo table, and lambda function. A one-time load is performed to push a sample data set containing information on near-earth asteroids and comets (here-on referred to as NEOs). Via an event handler, we kick off the lambda function, which parses our sample data and loads our dynamo table with the sample data set.

# The Data
The [data set contained](https://ssd-api.jpl.nasa.gov/doc/cad.html) houses the following information:


1. des - primary designation of the asteroid or comet (e.g., 443, 2000 SG344)
2. orbit_id - orbit ID
3. jd - time of close-approach (JD Ephemeris Time)
4. cd - time of close-approeach (formatted calendar date/time)
5. dist - nominal approach distance (au)
6. dist_min - minimum (3-sigma) approach distance (au)
7. dist_max - maximum (3-sigma) approach distance (au)
8. v_rel - velocity relative to the approach body at close approach (km/s)
9. v_inf - velocity relative to a massless body (km/s)
10. t_sigma_f - 3-sigma uncertainty in the time of close-approach (formatted in days, hours, and minutes; days are not included if zero; example “13:02” is 13 hours 2 minutes; example “2_09:08” is 2 days 9 hours 8 minutes)
11. body - name of the close-approach body (e.g., Earth)
12. h - absolute magnitude H (mag)