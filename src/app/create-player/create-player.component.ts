import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';
import { UtilsService } from '../shared/services/utils.service';

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
    private abilities: {};
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
        ABILITIES: [],
        SPELLS: []
    };

    private partOneComplete: boolean = false;
    private learnableCantrips = null;//
    private learnableSpells = null; // Not used until part 2 starts, when player class is finalized
    private selectedCantrips = null; //
    private selectedSpells = null;

    private nameAlertVisible: boolean = false;
    private nameAlertText: string = ``;

    constructor(private api: ApiService, private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService) { }

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
            this.rollHp();
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
        Gets the bonus the player's current race gives to
        the given stat score
    */
    getRaceScoreBonus(score: string): number{
        if(this.playerObj[`RACE_NAME`] !== `` && this.races)
            return this.races[this.playerObj[`RACE_NAME`]][`BASE_${score}`];
        return 0;
    }

    /*
        Rolls a new HP value based on player's
        current class
    */
    rollHp(){
        let hit_die = this.classes[this.playerObj[`CLASS_NAME`]][`HIT_DIE`];
        let minHpIncr = (hit_die / 2) + 1;
        let hpIncr = this.utils.getRandomInt(1, hit_die);
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
                rolls[i] = this.utils.getRandomInt(1, 6);
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
    finalizePartOne(){
        return Promise.resolve(this.refreshExistingPlayers().then(() => {
            // Verify name
            if(!this.verifyName()){
                this.toast.showToast(`alert-danger`, `Player name is invalid`);
                return false;
            }
            // Verify race
            if(!Object.keys(this.races).includes(this.playerObj[`RACE_NAME`])){
                this.toast.showToast(`alert-danger`, `Somehow your player race is invalid, how did you even manage that?`);
                return false;
            }
            // Verify class
            if(!Object.keys(this.classes).includes(this.playerObj[`CLASS_NAME`])){
                this.toast.showToast(`alert-danger`, `Somehow your player class is invalid, how did you even manage that?`);
                return false;
            }
            // Verify alignment
            if(!this.alignments.includes(this.playerObj[`ALIGNMENT`])){
                this.toast.showToast(`alert-danger`, `Somehow your alignment is invalid, how did you even manage that?`);
                return false;
            }
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
            }
            // Calculate remaining attributes using verified ones
            this.playerObj[`AC`] = 10 + parseInt(this.utils.getModifier(this.playerObj[`DEX`]+this.getRaceScoreBonus(`DEX`)).substr(1));
            this.playerObj[`MAX_HP`] = this.playerObj[`MAX_HP`] + parseInt(this.utils.getModifier(this.playerObj[`CON`]+this.getRaceScoreBonus(`CON`)).substr(1));
            this.playerObj[`SPD`] = this.races[this.playerObj[`RACE_NAME`]][`BASE_SPD`];
            // Get the player's abilites based on selected race and class
            this.api.GET(`/races/${this.playerObj['RACE_NAME']}/abilities`).then(res => {
                for(let ability of res){
                    this.playerObj[`ABILITIES`].push(ability[`ABILITY_NAME`]);
                }
                this.api.GET(`/classes/${this.playerObj[`CLASS_NAME`]}/abilities`).then(res2 => {
                    for(let ability of res2)
                        this.playerObj[`ABILITIES`].push(ability[`ABILITY_NAME`]);
                });
            });
            // Get all learnable spells of levels 0 and 1
            this.api.GET(`/classes/${this.playerObj[`CLASS_NAME`]}/spells`).then(res => {
                console.log(res)
                let learnableCantrips = {};
                let learnableSpells = {};
                for(let item of res){
                    if(item[`LV`] === 0)
                        learnableCantrips[item[`SPELL_NAME`]] = item;
                    if(item[`LV`] === 1)
                        learnableSpells[item[`SPELL_NAME`]] = item;
                }
                if(Object.keys(learnableCantrips).length == 0 && Object.keys(learnableSpells).length == 0){
                    // This class can't learn any magic at this level, so skip part 2
                    this.submitPlayer();
                }
                else{
                    this.learnableCantrips = learnableCantrips;
                    this.learnableSpells = learnableSpells;
                    this.selectedCantrips = {};
                    this.selectedSpells = {};
                    this.partOneComplete = true;
                }
            });
            return true;
        }));
    }

    finalizePartTwo(){
        let cantrips = [];
        for(let spell of Object.keys(this.selectedCantrips)){
            if(this.selectedCantrips[spell])
                cantrips.push(spell);
            if(cantrips.length > 2){
                this.toast.showToast(`alert-danger`, `Please select only two cantrips`);
                return false;
            }
        }
        // if(cantrips.length < 2){
        //     this.toast.showToast(`alert-danger`, `Please select two cantrips`);
        //     return false;
        // }
        let lv1spells = [];
        for(let spell of Object.keys(this.selectedSpells)){
            if(this.selectedSpells[spell])
                lv1spells.push(spell);
            if(lv1spells.length > 2){
                this.toast.showToast(`alert-danger`, `Please select only two cantrips`);
                return false;
            }
        }
        // if(lv1spells.length < 2){
        //     this.toast.showToast(`alert-danger`, `Please select two cantrips`);
        //     return false;
        // }
        this.playerObj[`SPELLS`] = cantrips.concat(lv1spells);
        this.submitPlayer();
        return true;
    }

    /*
        Ships the player object off to the API, 
        called only once all validation is complete
    */
    submitPlayer(){
        console.log(this.playerObj);
        this.api.PUT(`/campaign/${this.campaign}/players/${this.playerObj[`CHARACTER_NAME`]}`, this.playerObj).then(res => {
            this.toast.showToast(`alert-success`, `Player submitted!`);
        });
    }
}