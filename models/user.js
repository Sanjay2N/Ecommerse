const getDb=require("../util/database").getDb;
const mongodb=require("mongodb");
const Product = require("./product");
class User{
  constructor(name,email,cart,id){
    this.name=name;
    this.email=email;
    this.cart=cart;
    this._id=id;
  }
  save(){
    let db=getDb();
    return db.collection("user").insertOn(this).then(result=>{console.log(result)}).catch(error=>{console.log(error)});
  }

  addToCart(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
      return cp.productId.toString()===product._id.toString();
    })
    let newQuantity=1;
    const updatedCartItems=[...this.cart.items];
    if(cartProductIndex>=0){
      newQuantity=this.cart.items[cartProductIndex].quantity+1;
    updatedCartItems[cartProductIndex].quantity=newQuantity;
    }
    else{
      updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newQuantity})
    }
    const updatedCart={items:updatedCartItems};
    const db=getDb();
    return db.collection("user").updateOne({_id:new mongodb.ObjectId(this._id)}
    ,{$set:{cart:updatedCart}});

  }

  getCart(){
    const db=getDb();
    const productIds=this.cart.items.map(i=>{
      return i.productId;
    })
    return db.collection("products").find({_id:{$in :productIds}}).toArray()
    .then(products=>{
      return products.map(p=>{
        return {...p,quantity:this.cart.items.find(i=>{
          return i.productId.toString()===p._id.toString();
        }).quantity
      }
      })
    })
  }

  deleteCartItem(prodId){
    const db=getDb();
    const updatedCartItems=this.cart.items.filter(i=>{
      return i.productId.toString()!==prodId.toString();

    })
    return db.collection("user").updateOne({_id:new mongodb.ObjectId(this._id)}
    ,{$set:{cart:{items:updatedCartItems}}});
  }

  static findById(userId){
    let db=getDb();
    return db.collection("user").findOne({_id:new mongodb.ObjectId(userId)})
    .then(result=>{
      console.log(result);
      return result;
    })
    .catch(error=>{
      console.log(error);
    })
  }

}


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

module.exports = User;
