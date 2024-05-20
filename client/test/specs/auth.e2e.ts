import { $, expect } from '@wdio/globals';
import { loginAsNewUser, registerNewUser } from '../utils/login';

describe('Login', () => {
  it('should login as a new user', async () => {
    await loginAsNewUser();
    await new Promise((r) => setTimeout(r, 7000));
    expect(await $('//*[@id="app"]').isExisting()).toBeTruthy();
  });
});

describe('Registration', () => {
  it('should register a new user', async () => {
    await registerNewUser();
    expect(await $('//*[@id="reg-errors"]').isExisting()).toBeFalsy();
  });
});
