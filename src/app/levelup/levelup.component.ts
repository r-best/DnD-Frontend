import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService } from '../shared/services/utils.service';
import { ToastService } from '../shared/services/toast.service';

const models = require(`../shared/models/models`);

@Component({
    selector: 'app-levelup',
    templateUrl: './levelup.component.html',
    styleUrls: ['./levelup.component.css']
})
export class LevelupComponent implements OnInit {
    private campaign: string;
    private player: {} = models.player;
    private class: string = `Loading`;
    private level: number = 1;
    private hit_die: number = 0;

    // Flags to show the user the correct things they need for this level up
    private chooseSpellFlag: boolean = false;
    private chooseCantripFlag: boolean = false;
    private abilityScoreImprovementFlag: boolean = true;
    private test = false;

    // Variables for new cantrip section
    private newCantripOptions: {} = {};
    private selectedCantrips: {} = {};

    // Variables for new spells section
    private newSpellOptions: {}[] = [
        {}, // Level 1 spells
        {}, // Level 2 spells
        {}, // Level 3 spells
        {}, // Level 4 spells
        {}, // Level 5 spells
        {}, // Level 6 spells
        {}, // Level 7 spells
        {}, // Level 8 spells
        {}, // Level 9 spells
    ];
    private selectedSpells: {}[] = [
        {}, // Level 1 spells
        {}, // Level 2 spells
        {}, // Level 3 spells
        {}, // Level 4 spells
        {}, // Level 5 spells
        {}, // Level 6 spells
        {}, // Level 7 spells
        {}, // Level 8 spells
        {}, // Level 9 spells
    ];

    // Variables for ability score improvement section
    private chosenAbilities = {
        'STR': false,
        'DEX': false,
        'CON': false,
        'INT': false,
        'WIS': false,
        'CHA': false,
    };

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private location: Location, private utils: UtilsService, private toast: ToastService) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        let playerName = this.route.snapshot.params[`player`];
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}`)
        .then((res)=>{
            this.player = res;
        });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/level`)
        .then(res => {
            // Sorry, not supporting multiclassing right now
            this.class = res[0][`CLASS_NAME`];
            this.level = res[0][`LV`] + 1;
            this.api.GET(`/classes/${this.class}`)
            .then(res2 => this.hit_die = res2[`HIT_DIE`]);
            // Get new abilities for this level
            this.api.GET(`/classes/${this.class}/abilities/${this.level}`)
            .then(res2 => {
                this.player[`ABILITIES`] = [];
                for(let i = 0; i < res2.length; i++){
                    this.player[`ABILITIES`].push(res2[i][`ABILITY_NAME`]);
                }
            });
            this.setFlags();
        });
    }

    /*
        Sets the correct flags to show certain level up
        steps depending on what the user needs to do
        for this level
    */
    setFlags(){
        // Show ability score section if moving to level 4, 8, 12, 16, or 19
        if([4,8,12,16,19].includes(this.level))
            this.abilityScoreImprovementFlag = true;
        switch(this.class){
            case `sorcerer`:
                this.chooseSpellFlag = true;
                this.getNewSpellOptions();
                break;
            case `barbarian`:
                break;
        }
    }

    getNewSpellOptions(){
        if(this.level === 4 || this.level === 10)
            this.chooseCantripFlag = true;
        // Get all possible spells to learn
        this.api.GET(`/classes/${this.class}/spells`)
        .then(res => {
            // Get spells already known
            this.api.GET(`/campaigns/${this.campaign}/players/${this.player[`CHARACTER_NAME`]}/spells`)
            .then(res2 => {
                for(let i = 0; i < res.length; i++){ // Loop through possible spells
                    // If spell is too high level, remove it
                    if(res[i][`LV`] > Math.ceil(this.player[`LV`]/2)){
                        res.splice(i, 1);
                        i--;
                        continue;
                    }
                    for(let j = 0; j < res2.length; j++){ // Loop through known spells
                        // If a possible spell is already known, remove it
                        if(res[i][`SPELL_NAME`] === res2[j][`SPELL_NAME`]){
                            res.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                // Reformat & move complete list of learnable spells/cantrips to outer scope
                for(let i = 0; i < res.length; i++){
                    if(res[i][`LV`] === 0){
                        this.newCantripOptions[res[i][`SPELL_NAME`]] = res[i];
                        this.selectedCantrips[res[i][`SPELL_NAME`]] = false;
                    }
                    else{
                        this.newSpellOptions[res[i][`LV`]][res[i][`SPELL_NAME`]] = res[i];
                        this.selectedSpells[res[i][`LV`]][res[i][`SPELL_NAME`]] = false;
                    }
                }
            });
        });
    }

    rollHp(){
        let minHpIncr = (this.hit_die / 2) + 1;
        let hpIncr = this.utils.getRandomInt(1, this.hit_die);
        return hpIncr < minHpIncr ? minHpIncr : hpIncr;
    }

    submitPlayer(){
        let newData = {
            ALIGNMENT: this.player[`ALIGNMENT`],
            AC: this.player[`AC`],
            MAX_HP: this.player[`MAX_HP`],
            SPD: this.player[`SPD`],
            INSP: this.player[`INSP`],
            STR: this.player[`STR`],
            DEX: this.player[`DEX`],
            CON: this.player[`CON`],
            INT: this.player[`INT`],
            WIS: this.player[`WIS`],
            CHA: this.player[`CHA`],
            CLASS: {
                CLASS_NAME: this.class,
                LV: this.level
            },
            ABILITIES: this.player[`ABILITIES`],
            SPELLS: []
        };
        if(this.abilityScoreImprovementFlag){
            let abilities = []; // The chosen abilities at time of submit button click, should be of length 1 or 2
            for(let ability in this.chosenAbilities){
                if(this.chosenAbilities[ability])
                    abilities.push(ability);
            }
            if(abilities.length === 0){ // Need to choose at least one ability
                this.toast.showToast(`alert-info`, `Select at least one ability score to improve`);
                return false;
            }
            else if(abilities.length == 1){ // If one ability chosen, increase it by 2 points
                console.log(abilities[0], newData[abilities[0]])
                newData[abilities[0]] += 2;
                console.log(abilities[0], newData[abilities[0]])
            }
            else if(abilities.length === 2){ // If two abilities chosen, increase both by 1 point
                newData[abilities[0]] += 1;
                newData[abilities[1]] += 1;
            }
            else{ // Can't choose more than two abilities
                this.toast.showToast(`alert-info`, `Select at most two ability scores to improve`);
                return false;
            }
            newData[`AC`] = 10 + this.utils.getModifierAsInt(newData[`DEX`]);
            newData[`MAX_HP`] += this.rollHp() + this.utils.getModifierAsInt(newData[`CON`]);
        }
        if(this.chooseCantripFlag){
            let chosenCantrip = null;
            for(let cantrip in this.selectedCantrips){
                if(this.selectedCantrips[cantrip]){
                    if(chosenCantrip !== null){ // Can't have more than one cantrip selected
                        this.toast.showToast(`alert-info`, `Select at most one cantrip to learn`);
                        return false;
                    }
                    else{
                        chosenCantrip = cantrip;
                    }
                }
            }
            if(chosenCantrip === null){ // Need to select a cantrip
                this.toast.showToast(`alert-info`, `Select a cantrip to learn`);
                return false;
            }
            newData[`SPELLS`].push(chosenCantrip);
        }
        if(this.chooseSpellFlag){
            let chosenSpell = null;
            for(let level in this.selectedSpells){
                for(let spell in this.selectedSpells[level]){
                    if(this.selectedSpells[level][spell]){
                        if(chosenSpell !== null){ // Can't have more than one spell selected
                            this.toast.showToast(`alert-info`, `Select at most one spell to learn`);
                            return false;
                        }
                        else{
                            chosenSpell = spell;
                        }
                    }
                }
            }
            if(chosenSpell === null){ // Need to select a spell
                this.toast.showToast(`alert-info`, `Select a spell to learn`);
                return false;
            }
            newData[`SPELLS`].push(chosenSpell);
        }
        console.log(newData)
        this.api.PUT(`/campaigns/${this.campaign}/players/${this.player[`CHARACTER_NAME`]}`, newData)
        .then(res => {
            console.log(res)
            this.router.navigateByUrl(`/campaigns/${this.campaign}/${this.player[`CHARACTER_NAME`]}`);
        });
    }
}