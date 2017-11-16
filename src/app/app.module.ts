import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ApiService } from './shared/services/api.service';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpellbookComponent } from './spellbook/spellbook.component';
import { SpellpageComponent } from './spellpage/spellpage.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { PlayersComponent } from './players/players.component';
import { PlayerInfoComponent } from './player-info/player-info.component';

const routes: Routes = [
    {path: ``, redirectTo: `/dashboard`, pathMatch: `full`},
    {path: 'dashboard', component: DashboardComponent},
    {path: `spellbook`, component: SpellbookComponent},
    {path: `spellbook/:spell`, component: SpellpageComponent},
    {path: `campaigns`, component: CampaignsComponent},
    {path: `campaigns/:campaign`, component: PlayersComponent},
    {path: `campaigns/:campaign/:player`, component: PlayerInfoComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        SpellbookComponent,
        SpellpageComponent,
        CampaignsComponent,
        PlayersComponent,
        PlayerInfoComponent
    ],
    providers: [ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
