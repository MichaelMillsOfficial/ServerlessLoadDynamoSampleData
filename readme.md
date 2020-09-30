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

# How it works
Using the serverless framework, we create a CloudFormation stack consisting of an S3 Bucket, a Dynamo table, and a Serverless Function to be executed during the deploy. The serverless function execution will fetch the sample data using a default URL, and put it into our S3 Bucket as a .json file. The Dynamo table is created with a composite HASH and RANGE key, as the query I'm using by default returns NEO's with the same designation, but approaching other bodies (Earth, Moon, etc.) which allows us to load all the data with no issue.

Once we have the stack created, we then create an IAM role and a Lambda function. The IAM role will grant the Lambda function access to our S3 Bucket contents and CRUD operations for our Dynamo table. The function in question will, when executed, load the sample data json file and parse it; storing each NEO to our Dynamo table.

Once the stack and function are created (specifically, after stack outputs are displayed, in order to ensure we execute after everything has been created), a local serverless plugin will run and execute the function to load our table.