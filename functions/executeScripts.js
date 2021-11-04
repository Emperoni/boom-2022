exports = async function(solutionName){
  // test with: Nationwide sharded cluster: exports('Nationwide sharded cluster')
  console.log(solutionName);
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");
  const collection = context.services.get("mongodb-atlas").db("boom").collection("solutions");
  const collectionInstance = context.services.get("mongodb-atlas").db("boom").collection("assets");
  return collection.findOne({"name": solutionName})

  .then(result => {
    if(result){
      console.log(result.scripts.length);
      if(result.scripts && result.scripts.length > 0) {
        var instanceId='', userData ='';
        try {
          for( var i=0; i< result.scripts.length; i++){
            console.log(i);
            userData += result.scripts[i].script;
            console.log(userData.length);
          }
        }
        finally {
          // this has to run after the loop is complete.
          const risultato = ec2.RunInstances({
            "ImageId": result.environment.ami,
            "MaxCount": result.environment.maxCount,
            "MinCount": result.environment.minCount,
            "SecurityGroups": result.environment.securityGroups,
            "UserData": Base64.encode(userData),
            "KeyName": "dg-oregon",
            "InstanceType": result.environment.instanceType,
            //"TagSpecification": result.environment.tagSpecification,
            "TagSpecifications": result.environment.tagSpecifications,  //2021-11-04.
            "BlockDeviceMappings": result.environment.blockDeviceMappings

          })
          .then(risultato => {
            console.log(JSON.stringify(risultato));
            collectionInstance.insertOne(risultato);
            return risultato;
          })
        }

        return risultato;

      } else {
        return 'did not get a result (solution).';
      }

    }

  })
  .catch(err => console.error(`Failed to find document: ${err}`));
  //return solutionName;
};
