exports = function(arg){
  
    const collection = context.services.get("mongodb-atlas").db("boom").collection("assets");
    const matchStage1 = { "$match": {}};
    const projectStage1 = { "$project": {"name": 1}};
    return collection.aggregate([ matchStage1, projectStage1 ]);
};