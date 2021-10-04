exports = async function(scriptName){
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");
  const collection = context.services.get("mongodb-atlas").db("boom").collection("scripts");
  return collection.findOne({"name": scriptName})
  /*
  Script names are: 
  1. OM Instance
  2. MDB RS 
  
  */
  .then(result => {
      if(result){
        var instanceId;
        const userData = Base64.encode(result.script);
        //const userData = result.userData;
        console.log(userData);
        
        const risultato = ec2.RunInstances({
          "ImageId": result.ami,
          "MaxCount": 1,
          "MinCount": 1,
          "SecurityGroups": result.securityGroups,
          "UserData": userData,
          "KeyName": "dg-oregon",
          "InstanceType": result.instanceType,
          //"TagSpecification": result.tagSpecification,
          "BlockDeviceMappings": result.blockDeviceMappings 
        })
        return risultato;
      } else {
        return 'did not get a result.';
      }
    })
    .catch(err => console.error(`Failed to find document: ${err}`));
    
};
