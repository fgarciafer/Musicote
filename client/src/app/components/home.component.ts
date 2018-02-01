import {Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: '../views/home.html'
})

export class HomeComponent implements OnInit{
    public titulo: string;
    public search: string;

     constructor(
        private _route: ActivatedRoute,
        private _router: Router,
    ){
        this.titulo = "Home";     
    }

    ngOnInit(): void {
        console.log('home.component.ts cargado');
    }

    onBlurMethod(){
        alert(this.search);
    }

    buscar(event) {
        if(event.keyCode == 13) {
            this._router.navigate(['/buscar/'+this.search]);
        }
    }
}