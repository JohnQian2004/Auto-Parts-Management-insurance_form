import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[ngModel][trimText]',
    providers: [NgModel],
    host: {
        "(input)": 'onInputChange($event)',
        "(blur)": 'onBlur($event)',
    }
})
export class NoSpaceDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    
    onInputChange($event: { target: { value: string; }; }) {
        $event.target.value = $event.target.value.trimStart();
    }
    onBlur($event: { target: { value: string; }; }) {
        $event.target.value = $event.target.value.trimEnd();
        this.ngModelChange.emit($event.target.value);
    }
}