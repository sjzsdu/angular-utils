/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, TemplateRef } from '@angular/core';
import { ModalHeader, ModalHeaderTemplate } from './types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    header$ = new BehaviorSubject<ModalHeaderTemplate | undefined>(undefined);
    headerVar$ = new BehaviorSubject<ModalHeader | undefined>(undefined);

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
    private isTemplateReady = false;

    async headerTitlePromise(header: ModalHeader): Promise<TemplateRef<any> | string> {
        const key = this.headerVarKey(header);
        header.key = key;

        // If template is already ready, process immediately
        if (this.isTemplateReady) {
            const currentTemplate = this.header$.getValue();
            if (currentTemplate?.key === key) {
                return currentTemplate.template;
            }
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
                next: res => {
                    if (res?.key === key) {
                        clearTimeout(timeout);
                        this.isTemplateReady = true;
                        this.pendingRequests.delete(key);
                        resolve(res.template);
                        sub.unsubscribe();
                    }
                },
                error: err => {
                    clearTimeout(timeout);
                    this.pendingRequests.delete(key);
                    console.error('Template error:', err);
                    reject(err);
                },
            });
        });
    }

    setTemplateReady() {
        this.isTemplateReady = true;
        // Process any pending requests
        const currentTemplate = this.header$.getValue();
        if (currentTemplate) {
            const pending = this.pendingRequests.get(currentTemplate.key);
            if (pending) {
                pending.resolve(currentTemplate.template);
                this.pendingRequests.delete(currentTemplate.key);
            }
        }
    }
}
