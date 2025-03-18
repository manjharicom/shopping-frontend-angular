import { Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Configuration } from 'src/app/shared/models/configuration';
import { navItems, toBeIgnoredNavNames } from '../../_nav';
import { ICustomNavData } from './custom-nav-types';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navItems: ICustomNavData[] = navItems;
  toBeIgnoredNavNames: string[] = toBeIgnoredNavNames;
  open: boolean = true;
  linkActive: boolean | undefined;
  navigationEndObservable: Observable<any> | undefined;
  navSubscription: any;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkActivePage();
  }

  checkActivePage() {
    this.navItems.forEach((x) => {
      if (x.children) {
        x.children.forEach((y) => {
          y.active = false;
          if (
            y.url &&
            this.router.url.split(/[?#(;]/)[0] === y.url.split(/[?#(;]/)[0] &&
            !this.isDisabled(x)
          ) {
            x.open = true;
            y.active = true;
          }
        });
      } else {
        x.active = false;
        if (
          x.url &&
          this.router.url.split(/[?#(;]/)[0] === x.url.split(/[?#(;]/)[0] &&
          !this.isDisabled(x)
        ) {
          x.active = true;
        }
      }
    });
  }
  
  // isAvailableLink(item: any) {
  //   if (item.attributes && item.attributes.mustHaveChildren) {
  //     if (item.children) {
  //       var hasAvailableLink = item.children.some(
  //         (link) => this.getLinkType(link) !== 'disabled'
  //       );
  //       return hasAvailableLink;
  //     } else {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  isDisabled(item: ICustomNavData) {
    // check for userclaims
      return false;
  }

  getLinkType(item: any) {
    return this.isDisabled(item)
      ? 'disabled'
      : this.isExternalLink(item)
      ? 'external'
      : 'link';
  }

  isExternalLink(item: any) {
    return !!item.url || (item.url && item.url.substring(0, 4) === 'http');
  }

  hasChilren(navItem: any) {
    return !!navItem.children;
  }

}
@Component({
  selector: 'app-sidebar-nav-item',
  templateUrl: './sidebar-nav-item.html',
})

// tslint:disable-next-line:component-class-suffix
export class SidebarNavItem implements OnInit, OnDestroy {
  @Input() item: any;
  url: string | undefined;
  linkType: string | undefined;
  href: string | undefined;
  linkActive: boolean | undefined;
  navigationEndObservable: Observable<any>;
  navSubscription: any;
  linkClick: any;
  constructor(
    private router: Router,
  ) {
    this.router = router;
    this.linkClick = new EventEmitter();
    this.navigationEndObservable = router.events.pipe(
      filter((event) => {
        return event instanceof NavigationEnd;
      })
    );
  }

  ngOnInit(): void {
    this.init();
    this.url = this.item.url;
  }

  ngOnChanges() {
    //console.log(this.urlConfigurations);
    this.init();
  }

  ngOnDestroy() {
    // this.navSubscription.unsubscribe();
  }

  async init() {
  }

  isChangeLangShow(): boolean {
    return this.item.id === 'menu_change_language' && this.item.active;
  }

  // setUrl(item:any, configurations:any) {
  //   if (item.attributes && item.attributes.needSetUrl) {
  //     item.url = this.cofigurationService.getConfigurationValue(
  //       item.attributes.configrationUrlName,
  //       configurations
  //     );
  //   }
  // }

  goToLink(url: any) {
    if (
      this.item.IsAdminNotification === true &&
      url.match(/https?:\/\//) == null
    ) {
      url = `http://${url}`;
    }

    if (url.substring(0, 4) === 'http') {
      window.open(url, '_blank');
    }
  }

  getLinkType() {
    return this.isDisabled()
      ? 'disabled'
      : this.isExternalLink()
      ? 'external'
      : 'link';
  }
  
  isDisabled() {
    return false;
  }

  isAllowEmptyUrl() {
    var allowEmptyUrl =
      this.item.attributes && this.item.attributes.allowEmptyUrl;
    if (!allowEmptyUrl) {
      return this.item.url && this.item.url != '/';
    }

    return true;
  }

  isAllowSite() {
    return true;
  }

  isExternalLink() {
    return false;
  }
  linkClicked() {
    this.linkClick.emit();
  }
  transform(item: any) {
    const itemType = this.itemType(item);
    let itemClass;
    if (['divider', 'title'].includes(itemType)) {
      itemClass = `nav-${itemType}`;
    } else if (itemType === 'dropdown') {
      itemClass = 'nav-item nav-dropdown';
    } else {
      itemClass = 'nav-item';
    }
    return item.class ? `${itemClass} ${item.class}` : itemClass;
  }

  itemType(item: any) {
    if (item.divider) {
      return 'divider';
    } else if (item.title) {
      return 'title';
    } else if (item.children) {
      return 'dropdown';
    } else if (item.label) {
      return 'label';
    } else if (!Object.keys(item).length) {
      return 'empty';
    } else {
      return 'link';
    }
  }
}
