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
    private classes : {};
    private alignments = [
        'Lawful Good',
        'Lawful Neutral',
        'Lawful Evil',
        'Neutral Good',
        'True Neutral',
        'Neutral Evil',
        'Chaotic Good',
        'Chaotic Neutral',
        'Chaotic Evil'
    ];

    private playerObj = {
        CHARACTER_NAME: ``,
        RACE_NAME: `human`,
        CLASS_NAME: `barbarian`,
        ALIGNMENT: `Lawful Good`,
        AC: 0,
        MAX_HP: 0,
        SPD: 0,
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
            this.playerObj[`RACE_NAME`] = `human`;
            this.races = races;
            this.rollScores();
        });
        this.api.GET(`/classes`).then(res => {
            let classes = {};
            for(let item of res){
                classes[item[`CLASS_NAME`]] = item;
            }
            this.playerObj[`CLASS_NAME`] = `barbarian`;
            this.classes = classes;
            this.updateClass();
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

    /*
        Gets the modifier associated with a score as
        a string in the form of the modifier number
        with a plus or minus in front
    */
    getModifier(score: number): string{
        let modifier = Math.floor((score - 10) / 2);
        return modifier < 0 ? `${modifier}` : `+${modifier}`;
    }

    // Both min and max are inclusive
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*
        Gets the bonus the player's current race gives to
        the given stat score
    */
    getRaceScoreBonus(score: string): number{
        if(this.playerObj[`RACE_NAME`] !== `` && this.races)
            return this.races[this.playerObj[`RACE_NAME`]][`BASE_${score}`];
        return 0;
    }

    /*
        Called when the class select box is changed, 
        updates everything that needs to be updated on
        class change
    */
    updateClass(){
        this.rollHp();
    }

    /*
        Rolls a new HP value based on player's
        current class
    */
    rollHp(){
        let hit_die = this.classes[this.playerObj[`CLASS_NAME`]][`HIT_DIE`];
        let minHpIncr = (hit_die / 2) + 1;
        let hpIncr = this.getRandomInt(1, hit_die);
        this.playerObj[`MAX_HP`] = hpIncr < minHpIncr ? minHpIncr : hpIncr;
    }

    /*
        Rolls new values for all scores
    */
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

    /*
        Makes sure the player's name is valid and
        doesn't match any existing player names in
        this campaign
    */
    verifyName(): boolean{
        if(this.playerObj[`CHARACTER_NAME`] === ``){
            this.nameAlertText = `Please enter a name`;
            this.nameAlertVisible = true;
            return false;
        }
        if(!(new RegExp(`^[A-Za-z0-9-\\s]+$`).test(this.playerObj[`CHARACTER_NAME`]))){
            this.nameAlertText = `Name must contain only letters, numbers, hyphens, and spaces`;
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

    /*
        Performs final validation of player attributes
        and proceeds to next step of character creation
    */
    createPlayer(){
        let finalPlayer = {
            CHARACTER_NAME: ``,
            RACE_NAME: ``,
            CLASS_NAME: ``,
            ALIGNMENT: ``,
            AC: 0,
            MAX_HP: 0,
            SPD: 0,
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0,
        };
        this.refreshExistingPlayers().then(() => {
            // Verify name
            if(!this.verifyName()){
                this.toast.showToast(`alert-danger`, `Player name is invalid`);
                return false;
            }
            finalPlayer[`CHARACTER_NAME`] = this.playerObj[`CHARACTER_NAME`];
            // Verify race
            if(!Object.keys(this.races).includes(this.playerObj[`RACE_NAME`])){
                this.toast.showToast(`alert-danger`, `Somehow your player race is invalid, how did you even manage that?`);
                return false;
            }
            finalPlayer[`RACE_NAME`] = this.playerObj[`RACE_NAME`];
            // Verify class
            if(!Object.keys(this.classes).includes(this.playerObj[`CLASS_NAME`])){
                this.toast.showToast(`alert-danger`, `Somehow your player class is invalid, how did you even manage that?`);
                return false;
            }
            finalPlayer[`CLASS_NAME`] = this.playerObj[`CLASS_NAME`];
            // Verify alignment
            if(!this.alignments.includes(this.playerObj[`ALIGNMENT`])){
                this.toast.showToast(`alert-danger`, `Somehow your alignment is invalid, how did you even manage that?`);
                return false;
            }
            finalPlayer[`ALIGNMENT`] = this.playerObj[`ALIGNMENT`];
            // Verify stat scores
            let scores = [`STR`, `DEX`, `CON`, `INT`, `WIS`, `CHA`];
            for(let score of scores){
                if(this.playerObj[score] < 0){
                    this.toast.showToast(`alert-danger`, `${score} should not be less than 0, something's gone terribly wrong`);
                    return false;
                }
                if(this.playerObj[score] > 20){
                    this.toast.showToast(`alert-danger`, `${score} should not be greater than 20`);
                    return false;
                }
                finalPlayer[score] = this.playerObj[score];
            }
            // Calculate remaining attributes using verified ones
            finalPlayer[`AC`] = 10 + parseInt(this.getModifier(this.playerObj[`DEX`]+this.getRaceScoreBonus(`DEX`)).substr(1));
            finalPlayer[`MAX_HP`] = this.playerObj[`MAX_HP`] + parseInt(this.getModifier(this.playerObj[`CON`]+this.getRaceScoreBonus(`CON`)).substr(1));
            finalPlayer[`SPD`] = this.races[this.playerObj[`RACE_NAME`]][`BASE_SPD`];
            console.log(finalPlayer);
            return true;
        });
    }
}