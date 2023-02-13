const express = require('express');
const router = express.Router();
const {database} = require('../connection');


// GET ALL PRODUCTS

router.get('/',(req,res)=>{
   let page = (req.query.page != undefined && req.query.page != 0)? req.query.page : 1; //set the current page number
   const limit = (req.query.limit != undefined && req.query.limit != 0)? req.query.limit : 10; //set the limit of items per page
   
   let startValue;
   let endValue;

   if(page > 0){
     startValue = (page * limit) - limit; //0,10,20,30
     endValue = page * limit;
   }else{
      startValue = 0;
      endValue = 10;
   } 

   database.table('produtos as p')
   .join([
       {
           table: "categorias as c",
           on: `c.id = p.cat_id`
       }
   ])
   .withFields(['c.titulo as categoria',
       'p.titulo as nome',
       'p.preco',
       'p.quantidade',
       'p.descricao',
       'p.images',
       'p.id'
   ])
   .slice(startValue, endValue)
   .sort({id: .1})
   .getAll()
   .then(prods => {
       if (prods.length > 0) {
           res.status(200).json({
               count: prods.length,
               products: prods
           });
       } else {
           res.status(404).json({message: "Produtos não encontrados"});
       }
   })
   .catch(err => console.log(err));

});



/* GET ONE PRODUCT*/
router.get('/:prodId', (req, res) => {
   let productId = req.params.prodId;
   database.table('produtos as p')
       .join([
           {
               table: "categorias as c",
               on: `c.id = p.cat_id`
           }
       ])
       .withFields(['c.titulo as categoria',
           'p.titulo as name',
           'p.preco',
           'p.quantidade',
           'p.descricao',
           'p.images',
           'p.id'
       ])
       .filter({'p.id': productId})
       .get()
       .then(prod => {
           if (prod) {
               res.status(200).json(prod);
           } else {
               res.status(404).json({message: `No product found with id ${productId}`});
           }
       }).catch(err => res.json(err));
});


// GET AlL PRODUCTS FROM ONE PARTICULAR CATEGORY

router.get('/categoria/:catName',(req,res)=>{
   let page = (req.query.page != undefined && req.query.page != 0)? req.query.page : 1; //set the current page number
   const limit = (req.query.limit != undefined && req.query.limit != 0)? req.query.limit : 10; //set the limit of items per page
   
   let startValue;
   let endValue;

   if(page > 0){
     startValue = (page * limit) - limit; //0,10,20,30
     endValue = page * limit;
   }else{
      startValue = 0;
      endValue = 10;
   } 

   const cat_title = req.params.catName;

   database.table('produtos as p')
   .join([
       {
           table: "categorias as c",
           on: `c.id = p.cat_id WHERE c.titulo LIKE '%${cat_title}%'`
       }
   ])
   .withFields(['c.titulo as categoria',
       'p.titulo as nome',
       'p.preco',
       'p.quantidade',
       'p.descricao',
       'p.images',
       'p.id'
   ])
   .slice(startValue, endValue)
   .sort({id: .1})
   .getAll()
   .then(prods => {
       if (prods.length > 0) {
           res.status(200).json({
               count: prods.length,
               products: prods
           });
       } else {
           res.status(404).json({message: `Nenhum produto encontrado da categoria ${cat_title}`});
       }
   })
   .catch(err => console.log(err));
})

/* router.post('/create',(res,req)=>{
    let produtos = req.body;
    query_select = ('select titulo from produtos where id = ?');
    database.query(query_select,[produtos.titulo],(err,results)=>{
       if(!err){
          if(results.length <=0){
            res.status(200).json({message:'não existe'})
          }
       } 
    })
})
 */




module.exports = router;