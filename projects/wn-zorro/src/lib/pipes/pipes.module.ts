import { NgModule } from "@angular/core";
import { LabelPipe } from "./label.pipe";

const pipes = [LabelPipe];
@NgModule({
    declarations: pipes,
    imports: [],
    exports: pipes
})
export class PipesModule { }

