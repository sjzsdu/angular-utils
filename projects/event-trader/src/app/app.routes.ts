import { Routes } from '@angular/router';
import { CurrentTradeTableComponent } from './pages/current-trade-table/current-trade-table.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'current-trades', component: CurrentTradeTableComponent },
];
