import { expect } from '@wdio/globals';
import { blogPage } from '../pages/blog.page.ts';
import { loginAsNewUser } from '../utils/login';

describe('Post', () => {
  it('should create post', async () => {
    const postMessage = 'description';

    await loginAsNewUser();
    await blogPage.createPost(postMessage);

    const postMessageElementText = await blogPage.elementPostMessageText.getText();

    expect(postMessageElementText).toBe(postMessage);
  });
});
