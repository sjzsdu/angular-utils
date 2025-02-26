/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, TemplateRef } from '@angular/core';
import { AnyTemplateData, ITemplate, TemplateValues } from 'projects/wn-zorro/src/types/template';

import { BehaviorSubject, Subscription } from 'rxjs';

const TIMEOUT = 3000;

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  template$ = new BehaviorSubject<ITemplate | undefined>(undefined);
  templateVar$ = new BehaviorSubject<TemplateValues | undefined>(undefined);

  private templateCache = new Map<string, TemplateRef<any> | string>();

  templateKey(data: AnyTemplateData) {
    return `${data.category}-${data.data.templateKey}`;
  }

  private pendingRequests = new Map<
    string,
    {
      resolve: (value: TemplateRef<any> | string) => void;
      reject: (reason?: any) => void;
    }
  >();

  templatePromise(data: AnyTemplateData): Promise<TemplateRef<any> | string> {
    const key = this.templateKey(data);
    let sub: Subscription;

    if (this.templateCache.has(key)) {
      return Promise.resolve(this.templateCache.get(key)!);
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(key, { resolve, reject });
      this.templateVar$.next({ ...data.data, key } as TemplateValues);

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(key);
        resolve(key);
        console.warn(`Template timeout for ${key}`);
      }, TIMEOUT);

      sub = this.template$.subscribe({
        next: (res) => {
          if (res?.key === key) {
            clearTimeout(timeout);
            this.templateCache.set(key, res.template);
            this.pendingRequests.delete(key);
            resolve(res.template);
            sub?.unsubscribe();
          }
        },
        error: (err) => {
          clearTimeout(timeout);
          this.pendingRequests.delete(key);
          console.error('Template error:', err);
          reject(err);
        },
      });
    });
  }
}
