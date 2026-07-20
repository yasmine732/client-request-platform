import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de bord',
    url: '/dashboard',
    iconComponent: {
      name: 'cil-speedometer'
    }
  },
  {
    title: true,
    name: 'Gestion'
  },
  {
    name: 'Utilisateurs',
    url: '/users',
    iconComponent: {
      name: 'cil-user'
    }
  },
  {
    name: 'Clients',
    url: '/clients',
    iconComponent: {
      name: 'cil-people'
    }
  },
  {
    name: 'Demandes',
    url: '/demandes',
    iconComponent: {
      name: 'cil-list'
    }
  }
];
