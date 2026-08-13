export interface NavigationItem {
  id: string;
  title: string;
  type:
    | 'item'
    | 'collapse'
    | 'group';

  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [

  {
    id: 'dashboard-group',
    title: 'Tableau de bord',
    type: 'group',
    icon: 'icon-navigation',

    children: [
      {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'gestion-group',
    title: 'Gestion',
    type: 'group',
    icon: 'icon-navigation',

    children: [
      {
        id: 'users',
        title: 'Utilisateurs',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        icon: 'ti ti-users',
        breadcrumbs: false
      },

      {
        id: 'clients',
        title: 'Clients',
        type: 'item',
        classes: 'nav-item',
        url: '/clients',
        icon: 'ti ti-address-book',
        breadcrumbs: false
      },

      {
        id: 'demandes',
        title: 'Demandes',
        type: 'item',
        classes: 'nav-item',
        url: '/demandes',
        icon: 'ti ti-file-description',
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'analyse-group',
    title: 'Analyse',
    type: 'group',
    icon: 'icon-navigation',

    children: [
      {
        id: 'powerbi',
        title: 'Power BI',
        type: 'item',
        classes: 'nav-item',
        url: '/powerbi',
        icon: 'ti ti-chart-bar',
        breadcrumbs: false
      }
    ]
  }

];