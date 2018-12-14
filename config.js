const pgp			= require('pg-promise')(/*options*/);
module.exports = {

    'secret': 'thisisthebestsecret',
    //'database': 'postgres://wwezgigpimzyqa:51245111f5582aa18dc48a3c21f9f0dae2e773285428b7731ace341cbee8c867@ec2-54-247-119-167.eu-west-1.compute.amazonaws.com:5432/d98er28m6a6qle'
    cn : {
    host: 'ec2-54-247-119-167.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'd98er28m6a6qle',
    user: 'wwezgigpimzyqa',
    password: '51245111f5582aa18dc48a3c21f9f0dae2e773285428b7731ace341cbee8c867',
    ssl: true
    },
    //db = pgp(cn)
};

