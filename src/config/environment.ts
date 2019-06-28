import * as log from "loglevel";
import { isWindVandAvailable } from "../api/windvane";
// @ts-ignore
const DEVICE = window.__rm__device__ || 'desktop';

export const enum Environments {
  preLive = "preLive",
  production = "live"
}

function getCurrentEnvironment() {
  const isTest = /(&?)test=true/.test(location.search) || (location.host === 'local.lazada.sg');

  if (!isTest) {
    return Environments.production;
  } else {
    return Environments.preLive;
  }
}

export function getBasePath(): string {
  const path = location.pathname;
  if (path.indexOf("/support/m") === 0) {
    return "/support/m/";
  }  
  if (path.indexOf("/support") === 0) {
    return "/support/";
  }  
  if (path.indexOf("/m") === 0) {
    return "/m/";
  }
  return "/";
}

export function isMobile(): boolean {
  const words = ['android', 'iphone', 'ipad', 'ipod', 'kindle'];
  const agent = window.navigator.userAgent.toLowerCase();

  return isWindVandAvailable() || DEVICE === 'mobile' || words.some(word => agent.indexOf(word) >= 0);
}

export const currentEnvironment: Environments = getCurrentEnvironment();
export const basePath: string = getBasePath();

if (currentEnvironment === Environments.production) {
  log.setLevel("ERROR");
} else {
  log.setLevel("INFO");
}
