
import { Component , OnInit} from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;
  public busqueda;
  public search;
  public cambio;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user= new User('','','','','','ROLE_USER','');
    this.user_register= new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    console.log(this.user);

    // Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        console.log(response);
        let identity = response.user;
        this.identity = identity;
        this.errorMessage = "";
        if(!this.identity._id){
          alert("El usuario no esta correctamente identificado");
        }else{
          // Crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir el token para enviarselo a cada peticion http
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              console.log(response);
              let token = response.token;
              this.token = token;

              if(this.token.length <= 0){
                alert("El token no se ha generado");
              }else{
                // Crear elemento en el localstorage para tener token disponible
                localStorage.setItem('token',token);
                this.user= new User('','','','','','ROLE_USER','');
                console.log(token);
                console.log(identity);
                console.log(identity.role);
              }

            },
            error => {
              var errorMessage = <any>error;

                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  this.errorMessage= body.message;
                  console.log(error);
                }

            }
          );
        }

      },
      error => {
        var errorMessage = <any>error;

          if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.errorMessage= body.message;
            console.log(error);
          }

      }
    );
  }

  logout(){
    // borrar de uno en uno
    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    // borrar todo
    localStorage.clear();

    this.identity=null;
    this.token=null;

    this._router.navigate(['/']);
  }

  

  public onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email;
          this.user_register= new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
         }
      }
    );
  }

  abrirBuscar(bool){
    this.busqueda=bool;
    if(!bool){
      this.search=null;
    }
  }

  buscar(event) {
        if(event.keyCode == 13) {
            this._router.navigate(['/buscar/'+this.search]);
        }
    }
}
 