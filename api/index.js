'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err,res) =>{
    if(err){
        throw err;
    }else{
        console.log("La conexion a la base de datos esta corriendo correctamente...");


        app.listen(port, function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:"+port);
        });
    }

})
