'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');


function getAlbum(req,res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album: album});
            }
        }
    });
}

function getAlbumByName(req,res){

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;

    var albumName =req.params.name;
    var ExpReg = new RegExp(albumName);

    Album.find({title: ExpReg}).paginate(page, itemsPerPage, function(err, albums, total){
         Artist.populate(albums,{path: "artist"}, function(err, albums) {
            if(err){
                res.status(500).send({message: 'Error en la peticion'});
            }else{
                if(!albums){
                    res.status(404).send({message: 'No hay albums'});
                }else{
                    return res.status(200).send({
                        total_items: total,
                        albums: albums
                    });
                }
            }
         });
    });
}

function getAllAlbums(req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 8;

    Album.find({}).paginate(page, itemsPerPage, function(err, albums, total){
        Artist.populate(albums,{path: "artist"}, function(err, albums) {
            if(err){
                res.status(500).send({message: 'Error en la peticion'});
            }else{
                if(!albums){
                    res.status(404).send({message: 'No hay albums'});
                }else{
                    return res.status(200).send({
                        total_items: total,
                        albums: albums
                    });
                }
            }
        });
    });
}

function getAlbums(req,res){
    var artistId = req.params.artist;
    console.log(artistId);
    if(!artistId){
        //Sacar todos los albums de la bbdd
        var find = Album.find({}).sort('title');
    }else{
        //Sacar los albums de un artista dado
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'});
            }else{
                res.status(200).send({albums});
            }
        }
    });

}

function saveAlbum(req,res){
    var album = new Album();
    var params = req.body;
    console.log(params);
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err,albumStored) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se ha guardado el album'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });

}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'No se ha actualizado el album'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum (req,res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al borrar el album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error al borrar la cancion'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La cancion no ha sido eliminado'});
                        }else{
                           res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext= ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId,{image: file_name}, (err, albumUpdated) =>{ 
                if(!albumUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el album'});
                }else{
                    res.status(200).send({artist: albumUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Extension del archivo no correcta'})
        }
        console.log(file_split);
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen...'});
    }
}

function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' +imageFile;
    console.log(path_file);

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile,
    getAlbumByName,
    getAllAlbums
};