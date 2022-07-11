exports = function(arg){
  
    const collection = context.services.get("mongodb-atlas").db("boom").collection("assets");
    const matchStage1 = { "$match": {"name": {"$exists": true}}};
    const projectStage1 = { "$project": {"_id":0, "name": 1}};
    return collection.aggregate([ matchStage1, projectStage1 ]);
};