import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  user: any = null;
  show = false;

  private updateSubscription!: Subscription;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.updateSubscription = this.userService.update$.subscribe(() => {
      this.getUser();
    });

    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe((data) => {
      this.user = data;
    });
  }

  abilityShow() {
    setTimeout(() => {
      if (!this.user) this.show = true;
    }, 100);
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

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }
}
