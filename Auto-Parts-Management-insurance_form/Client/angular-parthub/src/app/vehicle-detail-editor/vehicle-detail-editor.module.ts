import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleDetailEditorComponent } from './vehicle-detail-editor.component';

@NgModule({
    declarations: [VehicleDetailEditorComponent],
    imports: [CommonModule, FormsModule],
    exports: [VehicleDetailEditorComponent]
})
export class VehicleDetailEditorModule { }


