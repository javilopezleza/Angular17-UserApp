import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {


  constructor(
    private router: Router,
    private sharingData: SharingDataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.handlerLogin();
  }


  handlerLogin() {
    this.sharingData.handlerLoginEventEmitter.subscribe(({ username, password }) => {
      console.log(username + ' ' + password);

      this.authService.loginUser({ username, password }).subscribe({
        next: response => {
          Swal.fire({
            title: "Inicio de sesión correcto",
            text: "",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then((result) => {
            if (result.isConfirmed) {
              const token = response.token;
              const payload = this.authService.getPayload(token);

              const user = { username: payload.sub };
              const login = {
                user,
                isAuth: true,
                isAdmin: payload.isAdmin
              };

              this.authService.token = token;
              this.authService.user = login;
              this.router.navigate(['/users/page/0']);
            }
          });
        },
        error: error => {
          if (error.status == 401) {
            Swal.fire({
              title: "Error al iniciar sesión",
              text: error.error.message,
              icon: "error",
              confirmButtonText: "Reintentar"
            })
          } else {
            throw error;
          }
        }

      })

    })
  }


}
