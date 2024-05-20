import { $, browser, expect } from '@wdio/globals';
import { v4 as uuid } from 'uuid';

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

export const login = async (username: string, password: string) => {
  await browser.url('http://localhost:3000/login');
  await $('#username').setValue(username);
  await $('#password').setValue(password);
  await $('button[type="submit"]').click();
};

const registerNewUser = async () => {
  const username = `user_${uuid()}`.substring(0, 12);
  const email = `${username}@mail.com`;
  const password = 'qwerty!1';
  await browser.url('http://localhost:3000/register');

  await $('#username').setValue(username);
  await $('#email').setValue(email);
  await $('#password').setValue(password);
  await $('#confirmPassword').setValue(password);
  await $('button[type="submit"]').click();

  return { username, email, password };
};

const loginAsNewUser = async () => {
  const credentials = await registerNewUser();
  await browser.pause(1000);
  await login(credentials.username, credentials.password);
  return credentials;
};
