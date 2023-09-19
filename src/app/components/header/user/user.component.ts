import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userService = this.userServiceConstructor;

  constructor(
    private router: Router,
    private userServiceConstructor: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUser();
  }

  quit() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  login() {
    if (this.router.url !== '/login' && this.router.url !== '/register') {
      localStorage.setItem('lastUrl', this.router.url);
      this.router.navigate(['/login']);
    }
  }
}
