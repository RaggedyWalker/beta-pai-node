/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decimal } from '@prisma/client/runtime/library';

export function convertDecimalToNumber(obj: any): any {
  if (obj instanceof Decimal) {
    return obj.toNumber();
  } else if (Array.isArray(obj)) {
    return obj.map(convertDecimalToNumber);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertDecimalToNumber(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
