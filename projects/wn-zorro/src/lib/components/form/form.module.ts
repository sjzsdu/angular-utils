import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../pipes';
import { FormComponent } from './form.component';
import { TemplateModule } from '../template/template.module';
import { ColorSelectComponent } from './color-select/color-select.component';
import { ArrayFormComponent } from './array-form/array-form.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { CodeMirrorEditorComponent } from './code-mirror-editor/code-mirror-editor.component';
import { FormArrayComponent } from './form-array/form-array.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { RangeComponent } from './range/range.component';
import { SliderComponent } from './slider/slider.component';
import { SortedSelectComponent } from './sorted-select/sorted-select.component';
import { TabFormComponent } from './tab-form/tab-form.component';
import { UploadComponent } from './upload/upload.component';
import { ListModule } from '../list/list.module';

const COMPONENTS = [
  FormComponent,
  ColorSelectComponent,
  ArrayFormComponent,
  CheckboxGroupComponent,
  CodeMirrorEditorComponent,
  FormArrayComponent,
  MarkdownEditorComponent,
  RangeComponent,
  SliderComponent,
  SortedSelectComponent,
  TabFormComponent,
  UploadComponent,
];
@NgModule({
  declarations: COMPONENTS,
  imports: [SharedModule, PipesModule, TemplateModule, ListModule],
  exports: COMPONENTS,
})
export class FormModule {}
