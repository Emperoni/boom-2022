exports = async function(assetId, apiEndpointId) {
  
  const args = ["62ce5d4c74a9284d109699ba"];
  const endpoint = await context.functions.execute("getApiEndpoints", ...args);
  console.log(endpoint);
  const response = await context.http.post({
    "scheme": endpoint.scheme,
    "host": endpoint.host,
    "path": endpoint.path,
    "headers": endpoint.headers,
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


