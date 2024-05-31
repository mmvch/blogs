import { $ } from '@wdio/globals';
import { homePage } from './home.page.ts';
import Page from './page.ts';

class BlogPage extends Page {
  get inputPostMessage() {
    return $('aria/What\'s on your mind?');
  }

  get elementPostMessageText() {
    return $('[id="post-message"]');
  }

  get btnSubmit() {
    return $('button[type="submit"]');
  }

  async createPost(postMessage: string) {
    await this.inputPostMessage.setValue(postMessage);
    await this.btnSubmit.click();
  }

  async open() {
    await homePage.open();
    await homePage.iconMenu.click();
    await homePage.iconMenuBlog.click();
    await browser.pause(500);
    return browser.getUrl();
  }
}

export const blogPage = new BlogPage();
