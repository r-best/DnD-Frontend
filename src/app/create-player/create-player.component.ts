import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-create-player',
    templateUrl: './create-player.component.html',
    styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit {
    private campaign: string;
    private existingPlayerNames: string[];
    private races: {}[];
    private classes : {}[];

    private usedNameAlertVisible: boolean = false;

    private inputName: string = "";
    private inputRace: string = "PUT INITIAL VALUE HERE";
    private inputClass: string = "barbarian";
    private inputAlignment: string = "Lawful Good";

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        this.api.GET(`/campaigns/${this.campaign}/players`).then(res => {
            this.existingPlayerNames = [];
            res.forEach(player => {
                this.existingPlayerNames.push(player[`CHARACTER_NAME`]);
            });
        });
        this.api.GET(`/races`).then(res => {
            this.races = res;
        });
        this.api.GET(`/classes`).then(res => {
            this.classes = res;
        });
    }

    verifyName(): boolean{
        for(let playerName of this.existingPlayerNames){
            if(playerName === this.inputName){
                this.usedNameAlertVisible = true;
                return false;
            }
        }
        this.usedNameAlertVisible = false;
        return true;
    }

    createPlayer(){
        
    }
}