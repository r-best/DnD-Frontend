import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';

const models = require(`../shared/models/models.ts`);

@Component({
    selector: 'app-create-player',
    templateUrl: './create-player.component.html',
    styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit {
    private campaign: string;
    private existingPlayerNames: string[];
    private races: {};
    private classes : {}[];

    private playerObj = {
        CHARACTER_NAME: ``,
        RACE_NAME: `human`,
        CLASS_NAME: `barbarian`,
        ALIGNMENT: `Lawful Good`,
        AC: 0,
        MAX_HP: 0,
        SPD: 0,
        INSP: 0,
        STR: 0,
        DEX: 0,
        CON: 0,
        INT: 0,
        WIS: 0,
        CHA: 0,
    };

    private nameAlertVisible: boolean = false;
    private nameAlertText: string = ``;

    constructor(private api: ApiService, private route: ActivatedRoute, private toast: ToastService) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        this.refreshExistingPlayers();
        this.api.GET(`/races`).then(res => {
            let races = {};
            for(let item of res){
                races[item[`RACE_NAME`]] = item;
            }
            this.races = races;
            this.rollScores();
        });
        this.api.GET(`/classes`).then(res => {
            this.classes = res;
        });
    }

    refreshExistingPlayers(){
        return this.api.GET(`/campaigns/${this.campaign}/players`).then(res => {
            this.existingPlayerNames = [];
            res.forEach(player => {
                this.existingPlayerNames.push(player[`CHARACTER_NAME`]);
            });
        });
    }

    getModifier(score: number): string{
        let modifier = Math.floor((score - 10) / 2);
        return modifier < 0 ? `${modifier}` : `+${modifier}`;
    }

    // Both min and max are inclusive
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRaceScoreBonus(score: string){
        return this.races[this.playerObj[`RACE_NAME`]][`BASE_${score}`];
    }

    rollScores(){
        let scores = [`STR`, `DEX`, `CON`, `INT`, `WIS`, `CHA`];
        for(let score of scores){
            this.playerObj[score] = 0;
            let rolls = [];
            for(let i = 0; i < 4; i++)
                rolls[i] = this.getRandomInt(1, 6);
            for(let i = 0; i < 3; i++){
                let highestIndex = rolls.indexOf(Math.max.apply(null, rolls));
                this.playerObj[score] += rolls[highestIndex];
                rolls.splice(highestIndex, 1);
            }
        }
    }

    verifyName(): boolean{
        if(this.playerObj[`CHARACTER_NAME`] === ``){
            this.nameAlertText = `Please enter a name`;
            this.nameAlertVisible = true;
            return false;
        }
        for(let playerName of this.existingPlayerNames){
            if(playerName === this.playerObj[`CHARACTER_NAME`]){
                this.nameAlertText = `'${this.playerObj[`CHARACTER_NAME`]}' already exists in this campaign`;
                this.nameAlertVisible = true;
                return false;
            }
        }
        this.nameAlertVisible = false;
        return true;
    }

    createPlayer(){
        this.refreshExistingPlayers().then(() => {
            if(!this.verifyName()){
                this.toast.showToast(`alert-danger`, `Player name is invalid`);
                return false;
            }
            this.toast.showToast(`alert-info`, `Not implemented yet!`);
            // this.api.PUT(`/campaigns/${this.campaign}/players/${this.playerObj[`CHARACTER_NAME`]}`, this.playerObj).then(res => {

            // });
            return true;
        });
    }
}