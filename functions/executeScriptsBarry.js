exports = async function(solutionName){
  console.log(solutionName);

  // DEPENDENCIES
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");

  // DERIVE THE AWS INIT SCRIPTS FROM THE DATABASE
  const solutionsCollection = context.services.get("mongodb-atlas").db("boom").collection("solutions");
  
  // RUN THE AWS INSTANCE CREATION SCRIPT
  return solutionsCollection.findOne({"name": solutionName}).then(result => {
    // VERIFY WE FOUND A RECORD IN THE SOLUTIONS COLLECTION
    if(result) {
      console.log(result.scripts.length);

      // WHEN INSTALLING A MONGODB CLUSTER WE MUST FIRST CREATE THE AWS INSTANCE, THEN ONCE THE INSTANCE IS CREATED WE APPLY
      // OS TUNEABLES.  THESE TUNEABLES ARE IN THE DATABASE RECORD IN THE FIELD 'scripts' WHICH IS AN ORDERED ARRAY.  ITERATE
      // ALL THE SCRIPTS IN THE ARRAY AND CONCAT TO A STRING VARIABLE.  ONCE THIS IS COMPLETED WE WILL CALL THE AWS CLI TO CREATE
      // THE AWS INSTANCE AND PASS THE STRING VARIABLE HOLDING THE SCRIPTS INTO THE AWS INSTANCE FOR EXECUTION.  THIS MEANS WE
      // MUST FIRST COLLATE THE SCRIPTS BEFORE CALLING THE AWS CREATION STEP.
      if(result.scripts && result.scripts.length > 0) {
        var instanceId='';
        var tuneablesScript ='';
        try {
          for( var i=0; i< result.scripts.length; i++){
            console.log(i);
            tuneablesScript += result.scripts[i].script;
            console.log(tuneablesScript.length);
          }
        }
        finally {
          // this has to run after the loop is complete.
          ec2.RunInstances({
            "ImageId": result.environment.ami,
            "MaxCount": result.environment.maxCount,
            "MinCount": result.environment.minCount,
            "SecurityGroups": result.environment.securityGroups,
            "UserData": Base64.encode(tuneablesScript),
            "KeyName": "dg-oregon",
            "InstanceType": result.environment.instanceType,
            "TagSpecification": 'ResourceType=instance,Tags=[{Key=Name,  Value="barry"}, {Key=owner,Value="barron.anderson"},{Key=expire-on,Value="2021-12-31"}]',
            //"TagSpecification": result.environment.tagSpecification,
            //"Tag": result.environment.tagSpecifications,  //2021-11-04. Tags are a separate call. https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/ec2-example-create-images.html
            "BlockDeviceMappings": result.environment.blockDeviceMappings
          }).then(ec2RunInstancesResults => {
            console.log(JSON.stringify(ec2RunInstancesResults));
            const assetsCollection = context.services.get("mongodb-atlas").db("boom").collection("assets");
            assetsCollection.insertOne(ec2RunInstancesResults);
            return ec2RunInstancesResults;
          })
        }
      } else {
        return 'No data found in database collection "solutions" where name = ' + solutionName + '.';
      }
    }
  }).catch(err => {
    console.error(`Failed to find document: ${err}`)
  });
};
