import { Component } from '@angular/core';
import { Profile } from 'src/app/core/models/Profile';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  profile?:any;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile();
    this.authService.profile.subscribe((profile:any)=>{
      this.profile = profile;
    })
  }

  logout() {
    this.authService.logout();
  }
}
