import { Injector, StaticProvider } from '@angular/core';

export function newInjector(parent: Injector | undefined, providers: StaticProvider[] = []) {
  return Injector.create({
    providers,
    parent,
  });
}
