exports = async function(solutionName){
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");
  const collection = context.services.get("mongodb-atlas").db("boom").collection("solutions");
  const collectionInstance = context.services.get("mongodb-atlas").db("boom").collection("assets");
  return collection.findOne({"name": solutionName})

  .then(result => {
    if(result){
      console.log(result);
      if(result.scripts && result.scripts.length > 0) {
        var instanceId, userData;
        try {
          for( var i=0; i< result.scripts.length; ){
            userData = userData =+ Base64.encode(result.scripts[i].script);
          }  
        } finally {
          // this has to run after the loop is complete.
          const risultato = ec2.RunInstances({
            "ImageId": result.environment.ami,
            "MaxCount": 1,
            "MinCount": 1,
            "SecurityGroups": result.environment.securityGroups,
            "UserData": userData,
            "KeyName": "dg-oregon",
            "InstanceType": result.environment.instanceType,
            //"TagSpecification": result.environment.tagSpecification,
            "BlockDeviceMappings": result.environment.blockDeviceMappings   
          })
        }
        return risultato;
      } else {
        return 'did not get a result (solution).';
      }
        
    }
      
  })
  .then(risultato => {
    collectionInstance.insertOne(risultato);
    return risultato;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));
};
