exports = function(arg){
    var collection = context.services.get("mongodb-atlas").db("boom").collection("assets");
    var returnValue = collection.find({},{"_id": 1, "name": 1}).toArray()
    
    return returnValue;
};