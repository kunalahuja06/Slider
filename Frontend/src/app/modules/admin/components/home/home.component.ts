import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private readonly authService:AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile();
  }
}
