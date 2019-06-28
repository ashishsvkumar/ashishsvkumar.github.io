import { currentEnvironment, Environments } from "./environment";

function getSelfServiceBase() {
  if (currentEnvironment === Environments.preLive) {
    return "//selfservice-api.alpha.redmart.com/v1.0.0/support";;
  }
  return "//selfservice-api.redmart.com/v1.0.0/support";
}

export const supportBase: string = getSelfServiceBase();
