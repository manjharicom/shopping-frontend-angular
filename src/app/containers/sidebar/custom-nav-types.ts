import {
    INavAttributes,
    INavBadge,
    INavLabel,
    INavLinkProps,
    INavWrapper,
  } from '@coreui/angular/lib/sidebar/app-sidebar-nav';
  
  export interface ICustomNavData {
    name?: string;
    id?: string;
    claimMapName?: string;
    claimMapNames?: string[];
    url?: string;
    href?: string;
    icon?: string;
    badge?: INavBadge;
    title?: boolean;
    open?: boolean;
    children?: ICustomNavData[];
    variant?: string;
    attributes?: INavAttributes;
    divider?: boolean;
    class?: string;
    label?: INavLabel;
    wrapper?: INavWrapper;
    linkProps?: INavLinkProps;
    active?: boolean;
    IgnoreClaim?: boolean;
    IsAdminNotification?: boolean;
    disabled?: boolean;
  }
  