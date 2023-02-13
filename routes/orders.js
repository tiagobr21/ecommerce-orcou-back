const express = require('express');
const router = express.Router();
const {database} = require('../connection');

//GET ALL ORDERS

router.get('/',(req,res)=>{
    database.table('ordensdetalhes as od')
    .join([
        {
            table:'ordens as o',
            on: 'o.id = od.order_id'
        },
        {
            table:'produtos as p',
            on:'p.id = product_id'
        },
        {
            table:'usuarios as u',
            on:'u.id = o.user_id'
        }
    ])
    .withFields(['o.id','p.titulo','p.descricao','p.preco','od.quantidade','u.username'])
    .getAll()
    .then(ordens =>{
        if(ordens.length >0){
            res.status(200).json(ordens);
        }else{
            res.status(500).json({message:'ordem não encontrada'})
        }
    }).catch(err => res.json(err));
})


// Place New Order
router.get('/:id', async (req, res) => {
    let orderId = req.params.id;
    database.table('ordensdetalhes as od')
        .join([
            {
                table: 'ordens as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'produtos as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'usuarios as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id','p.titulo','p.descricao','p.preco','od.quantidade','u.username'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({message: "Ordem não encontrada"});
            }

        }).catch(err => res.json(err));
});


// Place New Order
router.post('/new',(req, res) => {
        // let userId = req.body.userId;
    // let data = JSON.parse(req.body);
    let userId= req.body;

    console.log(userId)
    console.log(produtos)
     if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

            if (newOrderId > 0) {
                produtos.forEach(async (p) => {

                    let data = await database.table('produtos').filter({id: p.id}).withFields(['quantidade']).get();

                    let inCart = parseInt(p.incart);

                    // Deduct the number of pieces ordered from the quantity in database

                    if (data.quantidade > 0) {
                        data.quantidade = data.quantidade - inCart;

                        if (data.quantidade < 0) {
                            data.quantidade = 0;
                        }

                    } else {
                        data.quantidade = 0;
                    }

                    // Insert order details w.r.t the newly created order Id
                    database.table('orders_details')
                        .insert({
                            order_id: newOrderId,
                            product_id: p.id,
                            quantidade: inCart
                        }).then(newId => {
                        database.table('produtos')
                            .filter({id: p.id})
                            .update({
                                quantidade: data.quantidade
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                });

            } else {
                res.json({message: 'Criação de nova ordem falhou enquanto adiciona ordens detalhes', success: false});
            }
            res.json({
                message: `Ordem criada com sucesso com o  id ${newOrderId}`,
                success: true,
                order_id: newOrderId,
                produtos: produtos
            })
        }).catch(err => res.json(err));
    }

    else {
        res.json({message: 'Criação da nova ordem falhou', success: false});
    }

});

// Payment Gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});


module.exports = router;