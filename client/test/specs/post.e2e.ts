import { $, expect } from '@wdio/globals';
import { loginAsNewUser } from '../utils/login';

describe('Post', () => {
  it('should create post', async () => {
    const postMessage = 'description';

    await loginAsNewUser();
    await $('//*[@id="MenuIcon"]').click();
    await $('//*[@id="user-blog"]').click();

    await $("aria/What's on your mind?").setValue(postMessage);
    await $('button[type="submit"]').click();

    const postMessageElementText = await $('[id="post-card"]').getText();
    expect(postMessageElementText).toBe(postMessage);
  });
});
