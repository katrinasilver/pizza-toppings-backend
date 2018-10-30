const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const shortId = require('short-id')

const toppings = require('./toppings')
const { findById } = require('./middleware')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan("dev"))

 app.get('/toppings', function(req, res, next) {
  res.send({ toppings })
})

app.get('/toppings/:id', findById(toppings), function(req, res, next){  
  res.send({ topping: req.result })
})

app.post('/toppings', function(req, res, next){
  const {name, deliciousness } = req.body

  if(!name || !deliciousness)
    return next({statusCode: 400, message: 'Bad Request'})

  const topping = { id: shortId.generate(), name, deliciousness: parseInt(deliciousness) }
  toppings.push(topping)

  res.status(201).send({topping})
})

app.delete('/toppings/:id', findById(toppings), function(req, res, next){

  const id = toppings.indexOf(req.result)
  toppings.splice(id,1)

  res.send({ topping: req.result })

})

app.put('/toppings/:id', findById(toppings), function(req, res, next){
  const { name, deliciousness } = req.body
  if(name){
    req.result.name = name
  }
  if(deliciousness && !isNaN(parseInt(deliciousness))){
    req.result.deliciousness = parseInt(deliciousness)
  }
  
  res.send({ topping: req.result })
})


app.use(function(req, res, next){
  next({statusCode: 404, message: 'Not Found'})
})

app.use(function(err, req, res, next){
  const error = {}

  error.message = err.message || "Internal Server Error"
  error.statusCode = err.statusCode || 500
  error.stack = err.stack || undefined

  res.status(error.statusCode).send(error)
})

module.exports = app