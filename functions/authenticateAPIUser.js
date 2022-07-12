exports = async function() {
  const response = await context.http.post({
    "scheme": "https",
    "host": "realm.mongodb.com",
    "path": "/api/admin/v3.0/auth/providers/mongodb-cloud/login",
    "headers": {"Content-Type": [ "application/json" ], "Accept": [ "application/json" ]},
    "body": ['kwgbalst', 'fa8609bc-39ab-4bd4-8af5-4493daab09ba'],
    
    "username": "kwgbalst",
    "password": "fa8609bc-39ab-4bd4-8af5-4493daab09ba",
    "encodeBodyAsJSON": true
  })
  // The response body is a BSON.Binary object. Parse it and return.
  return EJSON.parse(response.body.text());
  /*
      "digestAuth": true,
    "data": {"username": "kwgbalst", "apiKey": "fa8609bc-39ab-4bd4-8af5-4493daab09ba"},
    
  */
};


