import { EventEmitter, Injectable } from '@angular/core';
import { ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { takeUntil } from 'rxjs';
import { FormControlStatus } from '@angular/forms';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { FormComponent } from './form.component';
import { FormItem } from './types';
import { isPromise } from 'wn-helper';
export interface ReactiveModalOptions extends ModalOptions {
  afterClose?: () => void;
  afterOpen?: () => void;
}

function defaultOptions(): ReactiveModalOptions {
  return {
    nzTitle: 'Modal Form',
    nzCancelText: null,
    nzOkDisabled: false,
    nzClassName: 'wn-form',
    nzContent: FormComponent,
    nzWidth: 400,
    nzMaskClosable: false,
  };
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  modalRef?: NzModalRef;
  constructor(
    private modal: NzModalService,
    private msg: NzMessageService
  ) {}
  selects = new Set();
  registerSelect(select: NzSelectComponent) {
    if (select) {
      this.selects.add(select);
    }
  }

  modalForm<T = any>(
    items: FormItem[],
    row: T | undefined,
    destroy$?: NzDestroyService,
    config?: ReactiveModalOptions,
    dynamicError = false,
    validateFunc?: (res: T) => boolean | string | Promise<boolean | string>
  ): Promise<T> {
    const modalOptions = {
      ...defaultOptions(),
      ...(config || {}),
    };
    modalOptions.nzData = { ...(modalOptions.nzData || {}), items, row };
    if (modalOptions.nzData.showError) {
      dynamicError = false;
    }
    const _destroy$ = destroy$ || new NzDestroyService();
    let modalRef: NzModalRef;
    return new Promise((resolve, reject) => {
      modalOptions.nzOnOk = () => {
        if (!modalRef?.componentInstance?.formValid() && !dynamicError) {
          modalRef?.componentInstance?.setShowError(true);
          return false;
        }
        const res = modalRef.componentInstance?.getValues();
        const newRow = { ...(row ?? {}), ...res };
        if (validateFunc) {
          const valRes = validateFunc(newRow);
          if (isPromise(valRes)) {
            return (valRes as Promise<string | boolean>).then((ress) => {
              const bool = this.showError(ress, modalRef);
              if (bool) {
                resolve(newRow as T);
              }
              return bool;
            });
          }
          const bool = this.showError(valRes as string | boolean, modalRef);
          if (bool) {
            resolve(newRow as T);
          }
          return bool;
        }
        resolve(newRow as T);
        return true;
      };
      modalOptions.nzOnCancel = () => {
        reject();
      };
      modalRef = this.modal.create<FormComponent>(modalOptions);
      if (dynamicError) {
        modalRef.afterOpen.pipe(takeUntil(_destroy$)).subscribe(() => {
          modalRef.updateConfig({
            ...modalOptions,
            nzOkDisabled: modalRef?.componentInstance?.validateForm?.status !== 'VALID',
          });
          modalRef.componentInstance?.validateForm?.statusChanges
            .pipe(takeUntil(_destroy$))
            .subscribe((status: FormControlStatus) => {
              modalRef.updateConfig({ ...modalOptions, nzOkDisabled: status !== 'VALID' });
            });
        });
      }
      if (modalOptions.afterClose) {
        modalRef.afterClose.pipe(takeUntil(_destroy$)).subscribe(() => {
          modalOptions.afterClose?.call(this);
        });
      }
      modalRef.afterOpen.pipe(takeUntil(_destroy$)).subscribe(() => {
        if (modalOptions.afterOpen) {
          modalOptions.afterOpen?.call(this);
        }
        if (this.selects.size) {
          const targets = document.querySelectorAll('.ant-modal-body');
          if (targets.length) {
            targets.forEach((target) => {
              target.addEventListener('scroll', () => {
                for (const select of this.selects) {
                  (select as unknown as NzSelectComponent)?.updateCdkConnectedOverlayPositions();
                }
              });
            });
          }
        }
      });
      this.modalRef = modalRef;
    });
  }

  detectChange() {
    if (this.modalRef && this.modalRef.getContentComponent()) {
      const reactiveForm = this.modalRef.getContentComponent();
      reactiveForm.renderTemplate();
    }
  }
  showError(valRes: string | boolean, modalRef: any) {
    if (!valRes) {
      return true;
    }
    if (typeof valRes === 'string') {
      this.msg.error(valRes);
    }
    modalRef?.componentInstance?.setShowError(true);
    return false;
  }
}
