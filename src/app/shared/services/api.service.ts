import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ToastService } from './toast.service';

const apiAddress: String = `http://localhost:3000/api`;

@Injectable()
export class ApiService {

    constructor(private http: Http, private toast: ToastService) { }

    GET(route: string): Promise<{}[]>{
        return this.http.get(`${apiAddress}${route}`)
            .map((res: Response) => {
                console.log(`GET ${route}`, res.json());
                return res.json();
            }).toPromise()
            .then(
                (res) => Promise.resolve(res),
                (err) => {
                    console.error(err);
                    this.toast.showToast(`alert-danger`, err.json());
                    return Promise.reject(err.json());
                }
            )
            .catch(err => {
                console.error(err);
                this.toast.showToast(`alert-danger`, err.json());
                return Promise.reject(err.json());
            });
    }
    
    PUT(route: string, body: {}): Promise<{}>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(`${apiAddress}${route}`, JSON.stringify(body), {headers: headers})
        .map((res: Response) => {
            console.log(`PUT ${route}`, res.json());
            return res.json();
        }).toPromise()
        .catch(err => {
            console.error(err);
            this.toast.showToast(`alert-danger`, err.json());
            return err.json();
        });
    }

    DEL(route: string): Promise<string>{
        return this.http.delete(`${apiAddress}${route}`)
        .map((res: Response) => {
            console.log(`DELETE ${route}`, res.json());
            return res.json();
        }).toPromise()
        .catch(err => {
            console.error(err);
            this.toast.showToast(`alert-danger`, err.json());
            return err.json();
        });
    }
}