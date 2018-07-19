import { Injectable } from '@nestjs/common';


@Injectable()
export class MapperService {
  map<F, T>(object: F, toClass: new () => T): T {
    const instance = new toClass();

    return Object.keys(instance).reduce((acc, key) => {
      acc[key] = object[key] ? object[key] : null;
      return acc;
    }, {}) as T;
  }
}
