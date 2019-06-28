import { get as getCookie, remove } from "es-cookie";
import { isEmptyString } from "./extras";
import { isWindVandAvailable, initiateLogin } from "../api/windvane";
import { currentEnvironment, Environments } from "../config/environment";

const USER_ID_KEY = "lzd_uid";
const SESSION_ID_KEY = "lzd_sid";

function cookieDomain() {
  let domain;
  if (location.hostname.indexOf('.test') >= 0) domain = '.lazada.test';
  else domain = '.lazada.sg';

  return { domain, path: '/' }
}

export function isLoggedIn() {
  if (currentEnvironment === Environments.preLive) {
    return true;
  }

  const id = getCookie(USER_ID_KEY);
  return !isEmptyString(id);
}

export function clearSession() {
  remove(USER_ID_KEY, cookieDomain());
  remove(SESSION_ID_KEY, cookieDomain());
}

export function getUserId() {
  if (currentEnvironment === Environments.preLive) {
    return '1904097086';
  }

  const id = getCookie(USER_ID_KEY);
  return isLoggedIn() ? id : null;
}

export function getSessionId() {
  if (currentEnvironment === Environments.preLive) {
    return 'foo-bar';
  }

  const id = getCookie(SESSION_ID_KEY);
  return isLoggedIn() ? id : null;
}

export function loginFrom(currentLocation: string = location.href): string {
  const param = `?redirect=${encodeURIComponent(currentLocation)}`;
  return `https://member.lazada.sg/user/login${param}`;
}

export function reLogin() {
  if (isWindVandAvailable()) {
    initiateLogin(() => {
      location.reload();
    })
  } else {
    clearSession();
    // @ts-ignore
    window.location = loginFrom();
  }
}