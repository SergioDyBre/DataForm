import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TokenStorageService {

    private token: string;

    constructor() {}

    public deleteToken(): void {
        this.token = null;
    }

    public saveToken(token: string): void {
        this.token = token;
    }

    public getToken(): string {
        return this.token;
    }
}