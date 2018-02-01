import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service'
import { Song } from'../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService,SongService,UploadService]
})

export class SongEditComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;

     constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ){
        this.titulo = "Editar canción";     
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'',0,'','');
        this.is_edit = true;
    }

    ngOnInit(): void {
        console.log('song-edit.component.ts cargado');
        //sacar la cancion a editar
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.getSong(this.token,id).subscribe(
                response => {
                    if(!response.song){
                        this._router.navigate(['/']);
                    }else{
                        this.song=response.song;
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

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
          
            this._songService.editSong(this.token,id,this.song).subscribe(
                response => {
                    console.log(response);
                    if(!response.song){
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'La cancion se ha actualizado correctamente';

                       if(!this.filesToUpload){
                            //Redirigir
                            this._router.navigate(['/album', response.song.album]);
                        }else{
                            //subir el fichero de audio
                            this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id,[],this.filesToUpload,this.token,'file')
                            .then(
                                (result) => {
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            ); 
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                        console.log(error);
                    }
                }
            );
        });
    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}