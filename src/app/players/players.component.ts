import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

const models = require(`../shared/models/models`);

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
    private campaign: string;
    private players: {}[];

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        this.refreshPlayerList();
    }

    refreshPlayerList(){
        this.api.GET(`/campaigns/${this.campaign}/players`).then((res)=>{
            this.players = res;
        });
    }
    
    confirmDeletePlayer(name: string){
        if(confirm(`Are you sure you want to delete '${name}'?`))
            alert(`I havent implemented this yet be patient`);
            // this.api.DEL(`/campaigns/${this.campaign}/players/${name}`).then(res => {
            //     this.refreshPlayerList();
            // });
    }
}