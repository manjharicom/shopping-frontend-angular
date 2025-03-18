import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DefaultLayoutComponent } from './containers';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
        path:'',
        component: DefaultLayoutComponent,
        data: {
          title: 'Home',
        },
        children:[
            {
              path: 'dashboard',
                loadChildren: () =>
                  import('./views/dashboard/dashboard.module').then(
                    (m) => m.DashboardModule
                  )
            },
            {
              path: 'search',
              loadChildren: () =>
                  import('./views/search/search.module').then(
                    (m) => m.SearchModule
                  )
            },
            {
              path: 'items',
              loadChildren: () =>
                  import('./views/items/items.module').then(
                    (m) => m.ItemsModule
                  )
            },
            {
              path: 'settings',
              loadChildren: () =>
                  import('./views/settings/settings.module').then(
                    (m) => m.SettingsModule
                  )
            },
            {
              path: 'shopping-list',
              loadChildren: () =>
                  import('./views/shopping-list/shopping-list.module').then(
                    (m) => m.ShoppingListModule
                  )
            },
            {
              path: 'supermarkets',
              loadChildren: () =>
                  import('./views/supermarkets/supermarkets.module').then(
                    (m) => m.SupermarketsModule
                  )
            },
            {
              path: 'trello',
              loadChildren: () =>
                  import('./views/trello/trello.module').then(
                    (m) => m.TrelloModule
                  )
            },
            {
              path: 'menu-planner',
              loadChildren: () =>
                  import('./views/menu-planner/menu-planner.module').then(
                    (m) => m.MenuPlannerModule
                  )
            }

        ]
    },
    { path: '**', component: DashboardComponent }
]


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}

  