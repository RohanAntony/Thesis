export enum NavType {
  DASHBOARD = 'Dashboard',
  SETTINGS = 'Settings',
  LOGS = 'Logs'
};

export interface NavButton {
  icon: string;
  name: NavType;
};
