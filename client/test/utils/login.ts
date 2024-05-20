import { v4 as uuid } from 'uuid';

export const login = async (username: string, password: string) => {
  await browser.url('http://localhost:3000/login');
  await $('#username').setValue(username);
  await $('#password').setValue(password);
  await $('button[type="submit"]').click();
};

export const registerNewUser = async () => {
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

export const loginAsNewUser = async () => {
  const credentials = await registerNewUser();
  await browser.pause(1000);
  await login(credentials.username, credentials.password);
  return credentials;
};
