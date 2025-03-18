import { ICustomNavData } from './containers/sidebar/custom-nav-types';

export const toBeIgnoredNavNames: string[] = ['Dashboard', 'Documents'];

export const navItems: ICustomNavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      id: 'menu_dashboard',
      icon: 'cui-dashboard',
    },
    {
      name: 'Search',
      url: '/search',
      icon: 'fas fa-file-signature',
      id: 'menu_search',
    },
    {
      name: 'Menu Planner',
      url: '/',
      icon: 'fas fa-bars',
      id: 'menu_menu-planner',
      children: [
        {
          name: 'Menus',
          url: '/menu-planner/menus',
          icon: 'icon',
          id: 'menu_menu-planner_menus',
        },
        {
          name: 'Recipes',
          url: '/menu-planner/recipes',
          icon: 'icon',
          id: 'menu_menu-planner_recipes',
        },
      ]
    },
    {
      name:"Shops",
      url: '/',
      icon: 'fas fa-store',
      id: 'menu_shops',
      children: [
        {
          name:"Shop List",
          url: '/supermarkets/list',
          icon: 'icon',
          id: 'menu_shops_list',
        },
        {
          name:"Set Shop",
          url: '/supermarkets/set',
          icon: 'icon',
          id: 'menu_shops_list',
        },
        {
          name:"Merge Category/Shop",
          url: '/supermarkets/merge',
          icon: 'icon',
          id: 'menu_shops_merge',
        },
        {
          name: 'New Shop',
          url: '/supermarkets/new',
          icon: 'icon',
          id: 'menu_shops_new',
        },
      ]
    },
    {
      name: 'Shopping List',
      url: '/',
      icon: 'fas fa-list',
      id: 'menu_shopping_list',
      children:[
        {
          name: 'Shopping Lists',
          url: '/shopping-list/list',
          icon: 'icon',
          id: 'menu_shopping_list_list',
        },
        {
          name: 'Shopping List Items',
          url: '/shopping-list/items',
          icon: 'icon',
          id: 'menu_shopping_list_items',
        },
        {
          name: 'New Shopping List',
          url: '/shopping-list/new',
          icon: 'icon',
          id: 'menu_shopping_list_new',
        },
        {
          name: 'Shopping List Prices',
          url: '/shopping-list/prices',
          icon: 'icon',
          id: 'menu_shopping_list_prices',
        },
      ]
    },
    {
      name: 'Items',
      url: '/',
      icon: 'icon-graph',
      id: 'menu_items',
      children: [
        {
          name: 'Categories',
          url: '/items/categories',
          icon: 'icon',
          id: 'menu_categories',
        },
        {
          name: 'Storage Areas',
          url: '/items/areas',
          icon: 'icon',
          id: 'menu_areas',
        },
        {
          name: 'Products',
          url: '/items/products',
          id: 'menu_products',
          icon: 'icon',
        },
        {
          name: 'Units of Measure',
          url: '/items/uoms',
          id: 'menu_uoms',
          icon: 'icon',
        },
      ],
    },
    {
      name: 'Trello',
      url: '/trello',
      icon: 'fas fa-cog',
      id: 'menu_trello',
    },
    {
      name: 'Settings',
      url: '/',
      icon: 'fas fa-cog',
      id: 'menu_settings',
      children: [
        {
          name: 'Shop Setup',
          url: '/settings/shop-setup',
          id: 'menu_shop_setup',
          icon: 'icon'
        },
      ],
    }
  ];
  