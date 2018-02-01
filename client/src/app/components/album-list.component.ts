import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [UserService,AlbumService,ArtistService]
})

export class AlbumListComponent implements OnInit{
    public titulo: string;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;

     constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService : UserService,
        private _albumService : AlbumService,
        private _artistService: ArtistService
    ){
        this.titulo = "Listado de albums";     
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1; 
        this.prev_page = 1;
        
    }

    ngOnInit(): void {
        console.log('album-list.component.ts cargado');

        this.getAlbums();
    }

    getAlbums(){
        this._route.params.forEach((params:Params)=>{
            let page = +params['page'];
            if(!page){
                page=1;
            }else{
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if(this.prev_page == 0){
                    this.prev_page =1;
                }
            }
            this._albumService.getAlbumsPerPage(this.token,page).subscribe(
               response => {
                    if(!response.albums){
                        this._router.navigate(['/']);
                    }else{
                        this.albums = response.albums;
                        console.log(this.albums);
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        console.log(error);
                    }
                }
            );
        });
    }

    /*onDeleteConfirm(id){
        this.confirmado = id;
    }

    onDeleteArtist(id){
        this._artistService.deleteArtist(this.token,id).subscribe(
            response => {
                if(!response.artist){
                    alert('Error en el servidor');
                }
                this.getArtists();
            },
            error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    //this.alertMessage = body.message;
                    console.log(error);
                }
            }
        );
    }

    onCancelArtist(){
        this.confirmado = null;
    }*/
}