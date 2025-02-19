import { Injectable, TemplateRef } from '@angular/core';
import { ModalHeader, ModalHeaderTemplate } from '../../../types/template';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  header$ = new BehaviorSubject<ModalHeaderTemplate | undefined>(undefined);
  headerVar$ = new BehaviorSubject<ModalHeader | undefined>(undefined);

  private templateCache = new Map<string, TemplateRef<any> | string>();

  headerTitle() {
    const template = this.header$.getValue();
    if (template) {
      return template.template;
    }
    return;
  }

  headerVarKey(header: ModalHeader) {
    return `${header.title}`;
  }

  private pendingRequests = new Map<
    string,
    {
      resolve: (value: TemplateRef<any> | string) => void;
      reject: (reason?: any) => void;
    }
  >();

  async headerTitlePromise(header: ModalHeader): Promise<TemplateRef<any> | string> {
    const key = this.headerVarKey(header);
    header.key = key;

    // return from cache if exist
    if (this.templateCache.has(key)) {
      return this.templateCache.get(key)!;
    }

    // Store the request
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(key, { resolve, reject });
      this.headerVar$.next(header);

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(key);
        resolve(`Header: ${header.title}`);
        console.warn(`Template timeout for header: ${header.title}`);
      }, 1000);

      const sub = this.header$.subscribe({
        next: (res) => {
          if (res?.key === key) {
            clearTimeout(timeout);
            this.templateCache.set(key, res.template);
            this.pendingRequests.delete(key);
            resolve(res.template);
            sub.unsubscribe();
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
