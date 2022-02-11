const services = require('./services');
const routers  = require('express').Router();


routers.get('/', services.aplicacao);

routers.get('/atividades', services.atividades);

routers.get('/taxas/:fat', services.taxas);

routers.post('/contato', services.contato);


module.exports = routers;