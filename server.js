const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const MongoC=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'hospitalManagement';
let db;
let col;
MongoC.connect(url,{useUnifiedTopology:true},(err,client)=>{
  if(!err) {
    db=client.db('Inventory');
    col=db.collection('Grains');
  }
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res)=>{
  col.find({isavailable:true}).toArray((err,result)=>{
    if(err) console.log(err);
    else res.render('index.ejs',{data:result})
  })
})

app.get('/addProduct',(req,res)=>{
  res.render('add_product.ejs');
})

app.get('/editProduct',(req,res)=>{
  res.render('edit_product.ejs');
})

app.get('/deleteProduct',(req,res)=>{
  res.render('delete_product.ejs');
})

app.post('/addData', (req,res)=>{
  var query=req.body
  if(query.pid!=""){
    console.log(query);
    col.insertOne({
                  pid:parseInt(query.pid),
                  pname:query.pname,
                  quantity: parseInt(query.quantity),
                  isavailable:true,
                  method:query.method,
                  price:parseInt(query.price),
                  category:query.category
                }, (err,result)=>{
                  if(err) return console.log(err)
                  res.redirect('/');
                });
  }
  else{
    res.redirect('/addProduct');
  }
})

app.post('/updateData',(req,res)=>{
  var query=req.body;
  console.log(query);
  var a = parseInt(query.pid);
  col.find({pid:a}).toArray((err,arr)=>{
    console.log(arr);
    if(arr.length==0) {   
      res.redirect('/editProduct');
    }
    else{
      if(query.pname!=="") arr[0].pname=query.pname;
      if(query.quantity!=="") arr[0].quantity=parseInt(query.quantity);
      if(query.price!=="") arr[0].price=parseInt(query.price);
      if(query.category!=="") arr[0].pname=query.category;
      if(query.method!==undefined) arr[0].method=query.method;
      col.updateOne({pid:a},
                    {$set:
                      {pname:arr[0].pname,
                      quantity:arr[0].quantity,
                      price: arr[0].price,
                      method:arr[0].method,
                      category: arr[0].category
                    }})
      res.redirect('/');
    } 
  });
     
})

app.post('/deleteData',(req,res)=>{
  var query=req.body;
  console.log(query);
  var a = parseInt(query.pid);
  col.find({pid:a}).toArray((err,arr)=>{
    console.log(arr);
    if(arr.length==0) {   
      res.redirect('/deleteProduct');
    }
    else{
      col.deleteOne({pid:a});
      res.redirect('/');
    }
}) 
});

app.get('/deletepartProduct',(req,res)=>{
  var a = parseInt(req.query.id);
  col.find({pid:a}).toArray((err,arr)=>{
    console.log(arr);
    if(arr.length!==0) col.deleteOne({pid:a});
    res.redirect('/');
  })
})

app.get('/editpartProduct',(req,res)=>{
  res.render('edit_part_product.ejs',{num:req.query.id});
})

app.post('/editpartData',(req,res)=>{
  var a = parseInt(req.query.id);
  var query = req.body;
  col.find({pid:a}).toArray((err,arr)=>{
    console.log(arr);
    if(arr.length==0) {   
      res.redirect('/editpartProduct');
    }
    else{
      if(query.pname!=="") arr[0].pname=query.pname;
      if(query.quantity!=="") arr[0].quantity=parseInt(query.quantity);
      if(query.price!=="") arr[0].price=parseInt(query.price);
      if(query.category!=="") arr[0].pname=query.category;
      if(query.method!==undefined) arr[0].method=query.method;
      col.updateOne({pid:a},
                    {$set:
                      {pname:arr[0].pname,
                      quantity:arr[0].quantity,
                      price: arr[0].price,
                      method:arr[0].method,
                      category: arr[0].category
                    }})
      res.redirect('/');
    } 
  });
})

app.listen(3000, () => {
console.log('Listening 3000')
}); 
