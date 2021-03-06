import { Directive, HostListener} from '@angular/core'

@Directive({
    selector: '[appDecimalOnly]'
})

export class DecimalOnlyDirective{
    key;
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.key = event.keyCode;
        //console.log(this.key);
        if ((this.key >= 15 && this.key <= 36) || (this.key >=41 && this.key <= 47) || (this.key >= 58 && this.key <= 95) || (this.key >= 106 && this.key <=189) || (this.key >=191)) {
          event.preventDefault();  //method cancels the event
        }
      }
}