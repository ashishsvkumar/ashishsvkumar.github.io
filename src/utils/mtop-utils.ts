import {get} from 'lodash';

export function deflattener(json: any) {
  return deflattenerHelper(json, json.data.hierarchy.root);
}

function deflattenerHelper(json: any, key: string) {
  const data = json.data.data;
  const childrenKeys: string[] = json.data.hierarchy.structure[key];

  const out: any = { ...data[key].fields, tag: data[key].tag };

  if (childrenKeys && childrenKeys instanceof Array && childrenKeys.length > 0) {
    const subdocuments: any[] = childrenKeys.map((childKey: string) => deflattenerHelper(json, childKey));

    subdocuments.forEach((doc: any) => {
      if (doc.hasOwnProperty('sequence') || isArray(doc, subdocuments)) {
        const childArrayName = `${doc.tag}s`

        if (!out.hasOwnProperty(childArrayName) || !(out[childArrayName] instanceof Array)) {
          out[childArrayName] = [];
        }
        out[childArrayName].push(doc);

      } else {
        out[doc.tag] = doc;
      }
    });
  }

  return out;
}

function isArray(doc: any, subdocuments: any[]): boolean {
  return subdocuments.map((d: any): number => d.tag === doc.tag ? 1 : 0).reduce((a, b) => a + b) > 1;
}

export function errorCode(response: any): string {
  const str = get(response, 'ret[0]', 'EXCEPTION::UNKNOWN')
  const error: string[] = str.split("::")
  return error[0]
}
