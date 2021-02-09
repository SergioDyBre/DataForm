import { Injectable } from "@angular/core";
import { TokenStorageService } from "./token-storage.service";

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class DataService{
    constructor(private token: TokenStorageService, private http: HttpClient) {}

    public getData(): Observable<any> {
        return this.http.get(environment.dataUrl + this.token.getToken());
    }

}