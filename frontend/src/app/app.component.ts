import { Component } from '@angular/core';
import { NavType } from './shared/enums/Navigation';
import { NavButton } from './shared/types/Navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Icarus';
  tabList: NavButton[] = [
    { name: NavType.COMPANY, icon: 'corporate_fare' },
    { name: NavType.MACROECONOMIC, icon: 'public' },
    { name: NavType.FUNDAMENTALS, icon: 'stacked_bar_chart' },
    { name: NavType.TECHNICAL, icon: 'ssid_charts' },
    { name: NavType.MODEL, icon: 'memory' },
    { name: NavType.PROCESSES, icon: 'grid_view' },
    { name: NavType.LOGS, icon: 'receipt_long' }
  ];
  selected: NavType = NavType.COMPANY;

  public selectTab(tab: NavType) {
    this.selected = tab;
  }
}
