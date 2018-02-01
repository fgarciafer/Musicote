'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!song){
                res.status(404).send({message: 'La cancion no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    });
}

function getSongByName(req,res){

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;

    var songName =req.params.name;
    var ExpReg = new RegExp(songName);
    Song.find({name: ExpReg}).paginate(page, itemsPerPage, function(err, songs, total){
         Album.populate(songs , {path: "album"},function(err, songs){
             Artist.populate(songs,{path: "album.artist"}, function(err, songs) {

                if(err){
                    res.status(500).send({message: 'Error en la peticion'});
                }else{
                    if(!songs){
                        res.status(404).send({message: 'No hay canciones'});
                    }else{
                        return res.status(200).send({
                        total_items: total,
                        songs: songs
                    });
                }
        }        

             });
        });
    });
}

function getSongs(req,res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate:{
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones!!'});
            }else{  
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req,res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored)=>{
        if(err){
            res.status(500).send({message: 'Error en el servicio'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se ha guardado la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    console.log(songId);
    console.log(update);

    Song.findByIdAndUpdate(songId,update, (err, songUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No se ha actualizado la cancion'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req,res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'No se ha borrado la cancion'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFile(req,res){
    var songId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext= ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId,{file: file_name}, (err, songUpdated) =>{ 
                if(!songUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar la cancion'});
                }else{
                    res.status(200).send({song: songUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Extension del archivo no correcta'})
        }
        console.log(file_split);
    }else{
        res.status(200).send({message: 'No ha subido ningun fichero de cancion...'});
    }
}


function getFile(req,res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' +songFile;
    console.log(path_file);

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe el fichero de audio...'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile,
    getSongByName
};