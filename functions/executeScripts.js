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
            console.log(userData);
          }  
        } 
        finally {
          // this has to run after the loop is complete.
          const risultato = ec2.RunInstances({
            "ImageId": result.environment.ami,
            "MaxCount": 1,
            "MinCount": 1,
            "SecurityGroups": result.environment.securityGroups,
            "UserData": Base64.encode(userData),
            "KeyName": "dg-oregon",
            "InstanceType": result.environment.instanceType,
            //"TagSpecification": result.environment.tagSpecification,
            "BlockDeviceMappings": result.environment.blockDeviceMappings 
          
          })
          return risultato;
        }
        
        return risultato;

      } else {
        return 'did not get a result (solution).';
      }
        
    }
      
  })
  //.then(risultato => {
  //  collectionInstance.insertOne(risultato);
  //  return risultato;
  //})
  .catch(err => console.error(`Failed to find document: ${err}`));
  //return solutionName;
};
