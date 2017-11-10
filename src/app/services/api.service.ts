import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const apiAddress: String = `http://localhost:3000/api`;

@Injectable()
export class ApiService {

    constructor(private http: Http) { }

    GET(route: string): Observable<{}>{
        return this.http.get(`${apiAddress}${route}`)
            .map((res: Response) => {
                let data = [];
                for(let i = 0; i < res.json().length; i++){
                    data[i] = res.json()[i];
                }
                return data;
            });
    }
}