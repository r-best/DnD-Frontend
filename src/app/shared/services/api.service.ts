import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const apiAddress: String = `http://localhost:3000/api`;

@Injectable()
export class ApiService {

    constructor(private http: Http) { }

    GET(route: string): Promise<{}[]>{
        return this.http.get(`${apiAddress}${route}`)
            .map((res: Response) => {
                console.log(`GET ${route}`, res.json());
                return res.json();
            }).toPromise();
            // .catch((err, observable) => {
            //     console.error(err)
            //     return null;
            // });
    }
    
    PUT(route: string, body: {}): Promise<{}>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(`${apiAddress}${route}`, JSON.stringify(body), {headers: headers})
        .map((res: Response) => {
            console.log(`PUT ${route}`, res.json());
            return res.json();
        }).toPromise();
    }

    DEL(route: string): Promise<string>{
        return this.http.delete(`${apiAddress}${route}`)
        .map((res: Response) => {
            console.log(`DELETE ${route}`, res.json());
            return res.json();
        }).toPromise();
    }
}