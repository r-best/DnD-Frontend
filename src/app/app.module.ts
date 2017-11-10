import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpellbookComponent } from './spellbook/spellbook.component';

const routes: Routes = [
    {path: ``, redirectTo: `/dashboard`, pathMatch: `full`},
    {path: 'dashboard', component: DashboardComponent},
    {path: `spellbook`, component: SpellbookComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        SpellbookComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
