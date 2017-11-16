import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private nav;

    private routerEventSubscription: Subscription;

    constructor(private router: Router) { }

    ngOnInit() {
        this.routerEventSubscription = this.router.events.subscribe(res => {
            if(res instanceof NavigationStart)
                this.nav = this.updateNav(res.url);
        });
    }

    ngOnDestroy() {
        this.routerEventSubscription.unsubscribe();
    }

    /*
        Method to generate the breadcrumb for the current route,
        gets called on every NaigationStart event
    */
    updateNav(url: string){
        let nav = [];
        nav[0] = {};
        nav[0].name = `Home`;
        if(url == "/" || url == "/dashboard")
            return nav;
        nav[0].link = `/`;
        
        let urlSplit = url.split(`/`);
        for(let i = 1; i < urlSplit.length; i++){
            if(!nav[i]) nav[i] = {};
            nav[i].name = decodeURI(urlSplit[i]);
            if(i != urlSplit.length-1){
                nav[i].link = "";
                for(let j = 1; j < nav.length; j++){
                    nav[i].link += "/" + nav[j].name;
                }
            }
        }
        return nav;
    }
}
