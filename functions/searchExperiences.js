exports = function(searchText){
  const collection = context.services.get("mongodb-atlas").db("boom").collection("experiences");
  return collection.aggregate([
  {
    '$search': {
      'compound': {
        'should': [
          {
            'autocomplete': {
              'query': searchText, 
              'path': 'category'
            }
          }, {
            'autocomplete': {
              'query': searchText, 
              'path': 'wisdom'
            }
          }
        ], 
        'minimumShouldMatch': 1
      }
    }
  }])
  .then(results =>{
    if(results){
      console.log(results[0].wisdom)
    }
  })
};