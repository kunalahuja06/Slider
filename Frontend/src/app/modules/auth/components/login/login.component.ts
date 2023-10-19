import { Component, Inject } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private readonly authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    if(this.authService.authenticated()){
      this.router.navigate(['admin/home']);
    }
  }
  login() {
    this.authService.login();
  }
}
