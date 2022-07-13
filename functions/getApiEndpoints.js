exports = async function(apiEndpointId){
  
    // 62ce5d4c74a9284d109699ba _id for Get Authentication Tokens: apiEndpointId
    
    const collection = context.services.get("mongodb-atlas").db("boom").collection("apiEndpoints");
    const matchStage1 = { "$match": {"_id": new BSON.ObjectId(apiEndpointId)}};
    const projectStage1 = { "$project": {"_id":0}};
    return await collection.aggregate([ matchStage1, projectStage1 ]);
};