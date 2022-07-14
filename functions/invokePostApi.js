exports = async function(assetId, apiEndpointId) {
  
  const args = ["62ce5d4c74a9284d109699ba"];
  let endpoint = await context.functions.execute("getApiEndpoints", ...args);
  console.log(JSON.stringify(endpoint));
  const response = await context.http.post({
    "scheme": "https",
    "host": "realm.mongodb.com",
    "path": "endpoint.path",
    "headers": {"Content-Type": [ "application/json" ], "Accept": [ "application/json" ]},
    "body": {"username": "kwgbalst", "apiKey": "fa8609bc-39ab-4bd4-8af5-4493daab09ba"},
    "encodeBodyAsJSON": true
  })
  // The response body is a BSON.Binary object. Parse it and return.
  return EJSON.parse(response.body.text());
  /*
  asset.apiKey
  {"Content-Type": [ "application/json" ], "Accept": [ "application/json" ]}
  removed
    "digestAuth": true,
    "username": "kwgbalst",
    "password": "fa8609bc-39ab-4bd4-8af5-4493daab09ba",
  
  
    "body": ['kwgbalst', 'fa8609bc-39ab-4bd4-8af5-4493daab09ba'],
    "body": {"kwgbalst": "fa8609bc-39ab-4bd4-8af5-4493daab09ba"},

    "body": [{'username': 'kwgbalst', 'apiKey': 'fa8609bc-39ab-4bd4-8af5-4493daab09ba'}],
    "digestAuth": true,
    "username": "kwgbalst",
    "password": "fa8609bc-39ab-4bd4-8af5-4493daab09ba",
    "data": {"username": "kwgbalst", "apiKey": "fa8609bc-39ab-4bd4-8af5-4493daab09ba"},
    
  */
};


