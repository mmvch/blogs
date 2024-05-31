import { browser } from '@wdio/globals';

export default class Page {
  open(path: string) {
    return browser.url(`http://localhost:3000/${path}`);
  }
}
