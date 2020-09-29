let AWS = require('aws-sdk')

let s3 = new AWS.S3();
let dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  var s3Params = {
    Bucket: event.BucketName,
    Key: event.FileName
  };

  const data = await s3.getObject(s3Params).promise();
  var mydata = JSON.parse((data.Body.toString()));

  for (var i = 0; i < mydata.data.length; i++) {
    var neo = mydata.data[i];
    var neoObject = {
      "des": neo[0],
      "orbit_id": Number(neo[1]),
      "jd": neo[2],
      "cd": neo[3],
      "dist": Number(neo[4]),
      "dist_min": Number(neo[5]),
      "dist_max": Number(neo[6]),
      "v_rel": Number(neo[7]),
      "v_inf": Number(neo[8]),
      "t_sigma_f": neo[9],
      "body": neo[10],
      "h": Number(neo[11])
    };

    var params = {
      Item: {
        "designation": {
          S: neoObject.des
        },
        "absolute_magnitude": {
          N: neoObject.h
        },
        "orbit_id": {
          N: neoObject.orbit_id
        },
        "time_of_close_approach": {
          S: neoObject.jd
        },
        "time_of_close_approach_calendar": {
          S: neoObject.cd
        },
        "approach_distance": {
          N: neoObject.dist
        },
        "approach_distance_min": {
          N: neoObject.dist_min
        },
        "approach_distance_max": {
          N: neoObject.dist_max
        },
        "relative_velocity": {
          N: neoObject.v_rel
        },
        "velocity": {
          N: neoObject.v_inf
        },
        "body": {
          S: neoObject.body
        },
        "close_time_approach_uncertainty": {
          S: neoObject.t_sigma_f
        }
      },
      TableName: event.TableName
    }

    var params = {
      Item: {
        "designation": neoObject.des,
        "absolute_magnitude": neoObject.h,
        "orbit_id": neoObject.orbit_id,
        "time_of_close_approach": neoObject.jd,
        "time_of_close_approach_calendar": neoObject.cd,
        "approach_distance": neoObject.dist,
        "approach_distance_min": neoObject.dist_min,
        "approach_distance_max": neoObject.dist_max,
        "relative_velocity": neoObject.v_rel,
        "velocity": neoObject.v_inf,
        "body": neoObject.body,
        "close_time_approach_uncertainty": neoObject.t_sigma_f
      },
      TableName: event.TableName
    }

    try {
      var result = await dynamodb.put(params).promise();
      console.log(`Added NEO ${neoObject.des}`);
    }
    catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: `Error loading data into ${event.TableName}`,
            input: event
          },
          null,
          2
        ),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Successfully loaded sample data!",
        input: event
      },
      null,
      2
    ),
  };
}