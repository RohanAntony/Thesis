import { Component } from '@angular/core';
import { NavButton, NavType } from './types/Navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Icarus';
  tabList: NavButton[] = [
    { name: NavType.DASHBOARD, icon: 'dashboard' },
    { name: NavType.SETTINGS, icon: 'settings' },
    { name: NavType.LOGS, icon: 'calendar_view_day' }
  ];
  selected: NavType = NavType.SETTINGS;

  public selectTab(tab: NavType) {
    this.selected = tab;
  }
}
