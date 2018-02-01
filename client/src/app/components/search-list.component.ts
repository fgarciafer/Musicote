import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'search-list',
    templateUrl: '../views/search-list.html',
    providers: [UserService,ArtistService,AlbumService,SongService]
})

export class SearchListComponent implements OnInit{
    public artists: Artist[];
    public albums: Album[];
    public songs: Song[];

    public identity;
    public token;
    public url: string;
    public alertMessage;

    public pageArtists:number;
    public pageSongs:number;
    public pageAlbum:number;

    public nextArtists =true;
    public nextAlbums =true;
    public nextSongs =true;

    public search;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService : UserService,
        private _artistService : ArtistService,
        private _albumService : AlbumService,
        private _songService : SongService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.pageArtists = 1;
        this.pageSongs = 1;
        this.pageAlbum = 1;
    }

    ngOnInit(): void {
        console.log('search-list.component.ts cargado');
        // llamar a los metodos que trareran los resultados de la busqueda
        this.getData();
    }

    getData(){
        this._route.params.forEach((params:Params)=>{
            let search = params['search'];
            this.search = search;
            this._artistService.getArtistsByName(this.token,search,this.pageArtists).subscribe(
                response => {
                    if(!response.artists){
                        this._router.navigate(['/']);
                    }else{
                        if(response.total_items>0){
                            this.artists = response.artists;
                        }else{
                            this.artists = null;
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        console.log(error);
                    }
                }
            )


            this._songService.getSongsByName(this.token,search,this.pageSongs).subscribe(
                response => {

                    if(!response.songs){
                        this._router.navigate(['/']);
                    }else{
                        if(response.total_items>0){
                            this.songs = response.songs;
                        }else{
                            this.songs = null;
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        console.log(error);
                    }
                }
            )

            this._albumService.getAlbumsByName(this.token,search,this.pageAlbum).subscribe(
                response => {
                    if(!response.albums){
                        this._router.navigate(['/']);
                    }else{
                        if(response.total_items>0){
                            this.albums = response.albums;
                        }else{
                            this.albums = null;
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        console.log(error);
                    }
                }
            )
        });
    }


    siguienteCancion(){
        if(this.nextSongs){
            this.pageSongs++;
            this._songService.getSongsByName(this.token,this.search,this.pageSongs).subscribe(
                response => {
                    if(!response.songs){
                        this._router.navigate(['/']);
                    }else{
                        if(response.total_items>0){
                            this.songs = response.songs;
                            if(response.songs.length<4 || (this.pageSongs*4 <= response.total_items)){
                                this.nextSongs=false;
                            }
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                    }
                }
            )
        }
    }

	anteriorCancion(){
        if(this.pageSongs>1){
            this.pageSongs--;
        }
        this.nextSongs=true;
        this._songService.getSongsByName(this.token,this.search,this.pageSongs).subscribe(
            response => {
                if(!response.songs){
                    this._router.navigate(['/']);
                }else{
                    if(response.total_items>0){
                        this.songs = response.songs;
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                }
            }
        )
    }

	siguienteAlbum(){
        this.pageAlbum++;
        this._albumService.getAlbumsByName(this.token,this.search, this.pageAlbum).subscribe(
            response => {
                if(!response.albums){
                    this._router.navigate(['/']);
                }else{
                    if(response.total_items>0){
                        this.albums = response.albums;
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                }
            }
        )
    }
	anteriorAlbum(){
        if(this.pageAlbum>1){
            this.pageAlbum--;
        }
        this._albumService.getAlbumsByName(this.token,this.search, this.pageAlbum).subscribe(
            response => {
                if(!response.albums){
                    this._router.navigate(['/']);
                }else{
                    if(response.total_items>0){
                        this.albums = response.albums;
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                }
            }
        )

    }
	siguienteArtista(){
        this.pageArtists++;
        this._artistService.getArtistsByName(this.token,this.search,this.pageArtists).subscribe(
            response => {
                if(!response.artists){
                    this._router.navigate(['/']);
                }else{
                    if(response.total_items>0){
                        this.artists = response.artists;
                    }
                }
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    console.log(error);
                }
            }
        )
    }
	anteriorArtista(){
        if(this.pageArtists>1){
            this.pageArtists--;
        }
        
        this._artistService.getArtistsByName(this.token,this.search,this.pageArtists).subscribe(
            response => {
                if(!response.artists){
                    this._router.navigate(['/']);
                }else{
                    if(response.total_items>0){
                        this.artists = response.artists;
                    }
                }
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    console.log(error);
                }
            }
        )
    }

    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-file-song/'+song.file;
        let image_path = this.url + 'get-image-album/'+ song.album.image;

        localStorage.setItem('sound_song',song_player);

        document.getElementById("mp3-source").setAttribute("src",file_path);
        (document.getElementById("player")as any).load();
        (document.getElementById("player")as any).play();

        document.getElementById("play-song-title").innerHTML = song.name;
        document.getElementById("play-song-artist").innerHTML = song.album.artist.name;
        document.getElementById("play-image-album").setAttribute('src', image_path);

    }
}