exports = async function(solutionName){
  // TO SIMPLIFY TESTING...
  solutionName = "Barry";
  console.log(solutionName);

  // REFERENCES
  // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ec2-example-creating-an-instance.html


  // EXAMPLE DOCUMENT TO TEST WITH:

  // {
  //   "_id": ObjectId("61a1296eb91c087ac062cea3"),
  //   "name": "Barry",
  //   "startDate": ISODate("2011-11-26T22:00:00.000Z"),
  //   "isComplete": false,
  //   "scripts": [
  //     {
  //       "step": 1,
  //       "name": "thp",
  //       "script": "#!/bin/bash\nyum update -y\n\nsudo touch /etc/systemd/system/disable-transparent-huge-pages.service\nsudo tee /etc/systemd/system/disable-transparent-huge-pages.service << 'EOF'\n[Unit]\nDescription=Disable Transparent Huge Pages (THP)\nDefaultDependencies=no\nAfter=sysinit.target local-fs.target\nBefore=mongod.service\n\n[Service]\nType=oneshot\nExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/enabled > /dev/null'\n\n[Install]\nWantedBy=basic.target\nEOF\n\nsudo systemctl daemon-reload\n\nsudo systemctl start disable-transparent-huge-pages\n"
  //     },
  //     {
  //       "step": 2,
  //       "name": "install mdb",
  //       "script": "cd /tmp\n\nwget https://repo.mongodb.com/yum/amazon/2/mongodb-enterprise/5.0/x86_64/RPMS/mongodb-enterprise-server-5.0.3-1.amzn2.x86_64.rpm\ncurl -OL https://downloads.mongodb.com/compass/mongodb-mongosh-1.1.1.el7.x86_64.rpm\n\nsudo yum install cyrus-sasl cyrus-sasl-gssapi cyrus-sasl-plain krb5-libs libcurl net-snmp openldap openssl xz-libs jq -y\n\nsudo rpm -ivh /tmp/mongodb-enterprise-server-5.0.3-1.amzn2.x86_64.rpm\n\nsudo mkdir -p /data/shard0\nsudo mkdir -p /data/appdb/\nsudo mkdir -p /data/bckdb\nsudo mkdir -p /data/keys/\nsudo chown -R mongod:mongod /data\n\nsudo chown mongod:mongod /data/shard0\n\nsudo rm -Rf /etc/mongod.conf\n\nsudo tee /etc/mongod.conf << 'EOF'\n# /etc/mongod.conf\nsystemLog:\n  destination: file\n  logAppend: true\n  logRotate: reopen\n  path: /var/log/mongodb/mongod.log\nstorage:\n  dbPath: /data/shard0\n  journal:\n    enabled: true\nprocessManagement:\n  fork: true  # fork and run in background\n  pidFilePath: /var/run/mongodb/mongod.pid\nnet:\n  port: 27017\n  bindIp: 0.0.0.0\nEOF\nsudo systemctl enable mongod\nsudo systemctl start mongod"
  //     },
  //     {
  //       "step": "3",
  //       "name": "create /etc/mongod.con",
  //       "script": "sudo rm -rf /etc/mongod.conf\n\ncat > /etc/mongod.conf << EOL\nsystemLog:\n  destination: file\n  logAppend: true\n  logRotate: reopen\n  path: /var/log/mongodb/mongod.log\nstorage:\n  dbPath: /data/appdb\n  journal:\n    enabled: true\n  wiredTiger:\n    engineConfig:\n      cacheSizeGB: 0.5\nprocessManagement:\n  fork: true  # fork and run in background\n  pidFilePath: /var/run/mongodb/mongod.pid\nnet:\n  port: 27017\n  bindIp: 0.0.0.0\nreplication:\n  replSetName: appDB\nEOL\n\nsudo systemctl enable mongod\nsudo systemctl stop mongod\nsudo systemctl start mongod"
  //     }
  //   ],
  //   "environment": {
  //     "ami": "ami-0142f6ace1c558c7d",
  //     "securityGroups": [
  //       "barry.anderson"
  //     ],
  //     "instanceType": "t3a.large",
  //     "blockDeviceMappings": [
  //       {
  //         "DeviceName": "/dev/xvda",
  //         "Ebs": {
  //           "DeleteOnTermination": true,
  //           "VolumeSize": NumberLong(20),
  //           "VolumeType": "gp2"
  //         }
  //       },
  //       {
  //         "DeviceName": "/dev/xvdb",
  //         "Ebs": {
  //           "DeleteOnTermination": true,
  //           "VolumeSize": NumberLong(100),
  //           "VolumeType": "io1",
  //           "Iops": NumberLong(1000)
  //         }
  //       }
  //     ],
  //     "minCount": NumberLong(3),
  //     "maxCount": NumberLong(3),
  //     "tagSpecifications": [
  //       {
  //         "ResourceType": "instance",
  //         "Tags": [
  //           {
  //             "Key": "Name",
  //             "Value": "Barry"
  //           },
  //           {
  //             "Key": "owner",
  //             "Value": "barron.anderson"
  //           },
  //           {
  //             "Key": "expire-on",
  //             "Value": "2021-12-31"
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }


  // DEPENDENCIES
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");

  // DERIVE THE AWS INIT SCRIPTS FROM THE DATABASE
  const solutionsCollection = context.services.get("mongodb-atlas").db("boom").collection("solutions");
  
  // RUN THE AWS INSTANCE CREATION SCRIPT
  solutionsCollection.findOne({"name": solutionName}).then(result => {
    // VERIFY WE FOUND A RECORD IN THE SOLUTIONS COLLECTION
    if(result) {
      console.log(result.scripts.length);

      // WHEN INSTALLING A MONGODB CLUSTER WE MUST FIRST CREATE THE AWS INSTANCE, THEN ONCE THE INSTANCE IS CREATED WE APPLY
      // OS TUNEABLES.  THESE TUNEABLES ARE IN THE DATABASE RECORD IN THE FIELD 'scripts' WHICH IS AN ORDERED ARRAY.  ITERATE
      // ALL THE SCRIPTS IN THE ARRAY AND CONCAT TO A STRING VARIABLE.  ONCE THIS IS COMPLETED WE WILL CALL THE AWS CLI TO CREATE
      // THE AWS INSTANCE AND PASS THE STRING VARIABLE HOLDING THE SCRIPTS INTO THE AWS INSTANCE FOR EXECUTION.  THIS MEANS WE
      // MUST FIRST COLLATE THE SCRIPTS BEFORE CALLING THE AWS CREATION STEP.
      if(result.scripts && result.scripts.length > 0) {
        var tuneablesScript ='';
        try {
          for (var i=0; i< result.scripts.length; i++){
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
            "TagSpecifications": result.environment.tagSpecifications,
            "BlockDeviceMappings": result.environment.blockDeviceMappings
          }).then(ec2RunInstancesResults => {
            console.log("ec2RunInstancesResults: " + JSON.stringify(ec2RunInstancesResults));
            const assetsCollection = context.services.get("mongodb-atlas").db("boom").collection("assets");
            assetsCollection.insertOne(ec2RunInstancesResults);

            var instanceIds = [];
            ec2RunInstancesResults.Instances.forEach(instance => {
              instanceIds.push(instance.InstanceId)
            });

            console.log(instanceIds);

            return instanceIds;
          })
        }
      } else {
        return 'No data found in database collection "solutions" where name = ' + solutionName + '.';
      }
    }
  }).catch(err => {
    console.error(`Failed to find document: ${err}`)
  });

  return "barry was successful"
};
