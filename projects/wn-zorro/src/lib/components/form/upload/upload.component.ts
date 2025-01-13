import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  TemplateRef,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Subscription, from, of } from 'rxjs';
import { BaseAccessorComponent } from '../base-accessor';
import { HttpClient, HttpRequest } from '@angular/common/http';

const defaultShowUploadList = { showRemoveIcon: true, showDownloadIcon: false };

@Component({
  selector: 'wn-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true,
    },
  ],
})
export class UploadComponent extends BaseAccessorComponent<string> {
  @Input() mode: 'server' | 'frontend' = 'frontend';
  @Input()
  set accept(str: string) {
    this._accept = str || '.json';
  }
  @Input()
  set showUploadList(
    config: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean }
  ) {
    if (typeof config === 'boolean') {
      this._showUploadList = config;
    } else {
      this._showUploadList = { ...defaultShowUploadList, ...(config ?? {}) };
    }
  }
  @Input() content?: TemplateRef<any> | string;
  @Output() fileContent = new EventEmitter();

  _accept: string = '.json';
  _showUploadList?: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean } =
    defaultShowUploadList;
  hasError: boolean = false;
  fileList: NzUploadFile[] = [];

  customRequest = (item: NzUploadXHRArgs): Subscription => {
    if (this.mode === 'frontend') {
      return of(true).subscribe(() => {
        this.handleFileUpload(item.file);
        setTimeout(() => {
          if (item.onSuccess) {
            item.onSuccess({}, item.file, {});
          }
        }, 200);
      });
    } else {
      const formData = new FormData();
      formData.append(item.name!, item.file as any);
      const req = new HttpRequest('POST', item.action!, formData, {
        reportProgress: true,
      });
      return this.http.request(req).subscribe(() => {});
    }
  };

  beforeUpload = (file: NzUploadFile): boolean | Observable<boolean> => {
    const names = file.name.split('.');
    const ext = names[names.length - 1].toLowerCase();
    if (this._accept.indexOf(ext) < 0) {
      return false;
    }
    return from([true]);
  };

  constructor(
    private injector: Injector,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  handleFileUpload = (file: NzUploadFile): void => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        let result = e.target.result;
        if (this._accept.includes('json')) {
          try {
            result = JSON.parse(e.target.result);
          } finally {
            this.change(result);
          }
        } else {
          this.change(result);
        }
      };
      if (this._accept.includes('json')) {
        fileReader.readAsText(file['slice']());
      } else {
        fileReader.readAsArrayBuffer(file['slice']());
      }
    }
  };
}
