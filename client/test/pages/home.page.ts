import { $ } from '@wdio/globals';
import Page from './page.ts';

class HomePage extends Page {
  get iconMenu() {
    return $('//*[@id="MenuIcon"]');
  }

  get iconMenuBlog() {
    return $('//*[@id="user-blog"]');
  }

  get iconMenuProfile() {
    return $('//*[@id="profile-menu-item"]');
  }

  get textAppName() {
    return $('//*[@id="app"]');
  }

  async open() {
    return super.open('');
  }
}

export const homePage = new HomePage();
