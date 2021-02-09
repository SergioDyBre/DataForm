import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient, private token: TokenStorageService) { }

    login(user: string, password: string) {
        const body = { email: user, password: password, returnSecureToken: true };

        return this.http.post<any>(environment.authUrl, body).pipe(map(response => {
            this.token.saveToken(response.idToken);
        }))
    }

    logout() {
        this.token.deleteToken();
    }

    isAuthenticated(): Boolean {
        return (this.token.getToken() != null);
    }
}