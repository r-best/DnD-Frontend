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
                console.log(res.json());
                return res.json();
            }).toPromise();
            // .catch((err, observable) => {
            //     console.error(err)
            //     return null;
            // });
    }
}