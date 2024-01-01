const mongodb=require("mongodb");
const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
  MongoClient.connect("mongodb+srv://sanjay:dFUVJO8vzo0chWvH@cluster0.jkknfem.mongodb.net/?retryWrites=true&w=majority")
  .then(client=>{
    console.log("Connected..");
    _db=client.db();
    callback();
  })
  .catch(error=>{
    console.log(error);
    throw error;
  })

  
}

const getDb=()=>{
  if(_db){
    return _db;
  }
  throw "No data base found";
}
exports.getDb=getDb;
exports.mongoConnect=mongoConnect;