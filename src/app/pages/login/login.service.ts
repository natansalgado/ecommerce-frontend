import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const loginData = {
      email,
      password,
    };

    return this.http.post<any>(`${apiUrl}/auth/login`, loginData);
  }
}
