import { $ } from '@wdio/globals';
import Page from './page.ts';

class HomePage extends Page {
  get iconMenu() {
    return $('//*[@id="MenuIcon"]');
  }

  get iconMenuBlog() {
    return $('//*[@id="user-blog"]');
  }

  async open() {
    return super.open('');
  }
}

export const homePage = new HomePage();
