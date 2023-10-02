import { Injectable } from '@angular/core';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { ReactiveFormItem, ReactiveFormParams } from './types';
import { FormComponent } from './form.component';
import { takeUntil } from 'rxjs';
import { FormControlStatus } from '@angular/forms';

function defaultOptions(): ModalOptions {
  return {
      nzTitle: 'Modal Form',
      nzCancelText: null,
      nzOkDisabled: false,
      nzClassName: 'form-modal',
      nzContent: FormComponent,
      nzWidth: 400,
  };
}


@Injectable({
  providedIn: 'root'
})
export class FormModalService {

  constructor(private modal: NzModalService, private msg: NzMessageService) {}

    modalForm<T = any>(
        items: ReactiveFormItem[],
        row: T | undefined,
        destroy$: NzDestroyService,
        config?: ModalOptions,
        dynamicError: boolean = false,
        validateFunc?: (res: T) => boolean | string
    ): Promise<T> {
        const modalOptions = {
            ...defaultOptions(),
            ...(config || {}),
        };
        modalOptions.nzData = { ...(modalOptions.nzData || {}), items, row };
        if (modalOptions.nzData.showError) {
            dynamicError = false;
        }
        return new Promise((resolve, reject) => {

            modalOptions.nzOnOk = () => {
                if (modalRef?.componentInstance?.validateForm?.status !== 'VALID' && !dynamicError) {
                    modalRef?.componentInstance?.setShowError(true);
                    return false;
                }
                const res = modalRef.componentInstance?.getValues();
                const newRow = { ...(row ?? {}), ...res };
                if (validateFunc) {
                    const valRes = validateFunc(newRow);
                    if (typeof valRes === 'string') {
                        this.msg.error(valRes);
                    }
                    if (valRes) {
                        modalRef?.componentInstance?.setShowError(true);
                        return false;
                    }
                }
                resolve(newRow as T);
                return true;
            };
            const modalRef = this.modal.create<FormComponent>(modalOptions);
            if (dynamicError) {
                modalRef.afterOpen.pipe(takeUntil(destroy$)).subscribe(() => {
                    modalRef.updateConfig({
                        ...modalOptions,
                        nzOkDisabled: modalRef?.componentInstance?.validateForm?.status !== 'VALID',
                    });
                    modalRef.componentInstance?.validateForm?.statusChanges
                        .pipe(takeUntil(destroy$))
                        .subscribe((status: FormControlStatus) => {
                            modalRef.updateConfig({ ...modalOptions, nzOkDisabled: status !== 'VALID' });
                        });
                });
            }
        });
    }
}
