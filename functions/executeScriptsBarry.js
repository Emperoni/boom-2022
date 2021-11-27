exports = async function(solutionName){
  // TO SIMPLIFY TESTING...
  solutionName = "Barry";
  console.log(solutionName);

  // REFERENCES
  // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ec2-example-creating-an-instance.html
  // https://aws.amazon.com/premiumsupport/knowledge-center/ec2-linux-log-user-data/


  // EXAMPLE DOCUMENT TO TEST WITH:

  // db.solutions.replaceOne({_id: ObjectId("61a1296eb91c087ac062cea3")}, 
  // {
  //   "_id": ObjectId("61a1296eb91c087ac062cea3"),
  //   "name": "Barry",
  //   "startDate": ISODate("2011-11-26T22:00:00.000Z"),
  //   "isComplete": false,
  //   "scripts": [
  //     {
  //       "step": 0,
  //       "scope": "all",
  //       "name": "shell setup",
  //       "script": "#!/bin/bash -xe \n "
  //     },
  //     {
  //       "step": 1,
  //       "scope": "all",
  //       "name": "Log all user data activity",
  //       "script": "exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1 \n "
  //     },
  //     {
  //       "step": 2,
  //       "scope": "all",
  //       "name": "yum update",
  //       "script": "yum update -y \n "
  //     },
  //     {
  //       "step": 3,
  //       "scope": "all",
  //       "name": "thp",
  //       "script": "sudo touch /etc/systemd/system/disable-transparent-huge-pages.service\nsudo tee /etc/systemd/system/disable-transparent-huge-pages.service << 'EOF'\n[Unit]\nDescription=Disable Transparent Huge Pages (THP)\nDefaultDependencies=no\nAfter=sysinit.target local-fs.target\nBefore=mongod.service\n\n[Service]\nType=oneshot\nExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/enabled > /dev/null'\n\n[Install]\nWantedBy=basic.target\nEOF\n\nsudo systemctl daemon-reload\n\nsudo systemctl start disable-transparent-huge-pages                                                          \n"
  //     },
  //     {
  //       "step": 4,
  //       "scope": "all",
  //       "name": "install mdb",
  //       "script": "echo '[mongodb-enterprise-5.0]\nname=MongoDB Enterprise Repository\nbaseurl=https://repo.mongodb.com/yum/amazon/2/mongodb-enterprise/5.0/$basearch/\ngpgcheck=1\nenabled=1\ngpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc' | sudo tee /etc/yum.repos.d/mongodb-enterprise-5.0.repo\nsudo yum -y install mongodb-enterprise\n"
  //     },
  //     {
  //       "step": 5,
  //       "scope": "all",
  //       "name": "create database folders and assign permissions",
  //       "script": "sudo mkdir -p /data/appdb\nsudo chown mongod:mongod /data/appdb\n"
  //     },
  //     {
  //       "step": 6,
  //       "scope": "all",
  //       "name": "create /etc/mongod.conf",
  //       "script": "sudo rm -rf /etc/mongod.conf\n\ncat > /etc/mongod.conf << EOL\nsystemLog:\n  destination: file\n  logAppend: true\n  logRotate: reopen\n  path: /var/log/mongodb/mongod.log\nstorage:\n  dbPath: /data/appdb\n  journal:\n    enabled: true\n  wiredTiger:\n    engineConfig:\n      cacheSizeGB: 0.5\nprocessManagement:\n  fork: true\n  pidFilePath: /var/run/mongodb/mongod.pid\nnet:\n  port: 27017\n  bindIp: 0.0.0.0\nreplication:\n  replSetName: appDB\nEOL\n"
  //     },
  //     {
  //       "step": 7,
  //       "scope": "all",
  //       "name": "start database",
  //       "script": "sudo systemctl enable mongod\nsudo systemctl stop mongod\nsudo systemctl start mongod\n"
  //     },
  //     {
  //       "step": 8,
  //       "scope": "last",
  //       "name": "collate hostnames to prep for replicaset init",
  //       "script": "echo $HOSTNAME | tee -a /tmp/priorInstanceDetails.txt \n"
  //     },
  //     {
  //       "step": 8,
  //       "scope": "last",
  //       "name": "collate hostnames to prep for replicaset init pt 2",
  //       "script": "readarray -t hostnames < /tmp/priorInstanceDetails.txt \n"
  //     },
  //     {
  //       "step": 8,
  //       "scope": "last",
  //       "name": "collate hostnames to prep for replicaset init pt 3",
  //       "script": "members=() \n for t in ${!hostnames[@]}; do members+='{_id: '$t', host: \"'${hostnames[$t]}':27017\"},'; done \n"
  //     },
  //     {
  //       "step": 9,
  //       "scope": "last",
  //       "name": "create replica set init command",
  //       "script": "rsInitCommand='rs.initiate({_id: \"appDB\", version: 1, members: ['$members']})' \n"
  //     },
  //     {
  //       "step": "9x",
  //       "scope": "last",
  //       "name": "create replica set init command",
  //       "script": "echo $rsInitCommand | sudo tee /tmp/initCmd.txt \n"
  //     },
  //     {
  //       "step": 10,
  //       "scope": "last",
  //       "name": "initialize replica set",
  //       "script": "mongo --eval \"$rsInitCommand\" \n"
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
  // )


  // DEPENDENCIES
  const Base64 = require("js-base64");
  const ec2 = context.services.get('connectAws').ec2("us-west-2");

  // DERIVE THE AWS INIT SCRIPTS FROM THE DATABASE
  const solutionsCollection = context.services.get("mongodb-atlas").db("boom").collection("solutions");
  
  // RUN THE AWS INSTANCE CREATION SCRIPT
  solutionsCollection.findOne({"name": solutionName}).then(result => {
    // VERIFY WE FOUND A RECORD IN THE SOLUTIONS COLLECTION
    if(result) {
      // WHEN INSTALLING A MONGODB CLUSTER WE MUST FIRST CREATE THE AWS INSTANCE, THEN ONCE THE INSTANCE IS CREATED WE APPLY
      // OS TUNEABLES.  THESE TUNEABLES ARE IN THE DATABASE RECORD IN THE FIELD 'scripts' WHICH IS AN ORDERED ARRAY.  ITERATE
      // ALL THE SCRIPTS IN THE ARRAY AND CONCAT TO A STRING VARIABLE.  ONCE THIS IS COMPLETED WE WILL CALL THE AWS CLI TO CREATE
      // THE AWS INSTANCE AND PASS THE STRING VARIABLE HOLDING THE SCRIPTS INTO THE AWS INSTANCE FOR EXECUTION.  THIS MEANS WE
      // MUST FIRST COLLATE THE SCRIPTS BEFORE CALLING THE AWS CREATION STEP.
      if(result.scripts && result.scripts.length > 0) {
        // A SERIES OF SCRIPTS FOR EACH NODE IN THE REPLICA SET.
        // THE SCOPE OF THE SCRIPT DETERMINES IF THE SCRIPT SHOULD BE APPLIED TO THE FIRST MEMBER OF THE REPLICA SET, THE LAST MEMBER
        // OR ALL THE MEMBERS.
        var tuneablesScripts = new Array(result.environment.maxCount);
        for (var i = 0; i < result.scripts.length; i++) {
          tuneablesScripts[i] = "";
        }

        try {
          for (var i = 0; i < result.scripts.length; i++){
            // FIRST NODE GETS SCRIPTS WITH SCOPE "first"
            if (result.scripts[i].scope == "first") {
              tuneablesScripts[0] += result.scripts[i].script;
            }

            // ALL NODES GET THE SCRIPT WITH SCOPE "all"
            if (result.scripts[i].scope == "all") {
              for (var j = 0; j < result.environment.maxCount; j++) {
                tuneablesScripts[j] += result.scripts[i].script;
              }
            }

            // THE LAST NODE GETS SCRIPTS WITH SCOPE "last"
            if (result.scripts[i].scope == "last") {
              tuneablesScripts[result.environment.maxCount - 1] += result.scripts[i].script;
            }
          }
        }
        finally {
          var instanceDetails = "";
          createAWSInstances(tuneablesScripts, result.environment, 0, result.environment.maxCount, instanceDetails);
        }
      } else {
        return 'No data found in database collection "solutions" where name = ' + solutionName + '.';
      }
    }
  }).catch(err => {
    console.error(`Failed to find document: ${err}`)
  });

  function createAWSInstances(tuneablesScripts, environment, currentInstanceIndex, maxInstanceIndex, priorInstanceDetails) {
    if (currentInstanceIndex < maxInstanceIndex) {
      // FOR DEBUGGING PURPOSES ADD A LOG FILE THAT KEEPS TRACK OF WHAT WAS PASSED IN user-data.
      // TO USE THIS, SSH INTO THE LAST NODE OF THE REPLICA SET AND RUN `tail -f /var/log/user-data.log`
      tuneablesScripts[currentInstanceIndex] = "#!/bin/bash -xe \n exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1 \n echo '" + priorInstanceDetails + "' | tee /tmp/priorInstanceDetails.txt \n " + tuneablesScripts[currentInstanceIndex];
      
      console.log(currentInstanceIndex);
      console.log(tuneablesScripts[currentInstanceIndex]);
      console.log(priorInstanceDetails);

      ec2.RunInstances({
        "ImageId": environment.ami,
        "MaxCount": 1,
        "MinCount": 1,
        "SecurityGroups": environment.securityGroups,
        "UserData": Base64.encode(tuneablesScripts[currentInstanceIndex]),
        "KeyName": "dg-oregon",
        "InstanceType": environment.instanceType,
        "TagSpecifications": environment.tagSpecifications,
        "BlockDeviceMappings": environment.blockDeviceMappings
      }).then(results => {
        results.Instances.forEach(instance => {
          if (priorInstanceDetails == "") {
            priorInstanceDetails = instance.PrivateDnsName;
          }
          else
          {
            priorInstanceDetails = priorInstanceDetails + "\n" + instance.PrivateDnsName;
          }
        });
        
        runInstances(tuneablesScripts, environment, currentInstanceIndex + 1, maxInstanceIndex, priorInstanceDetails) ;
      });
      
    }
  }
  
  return "barry was successful"
};
