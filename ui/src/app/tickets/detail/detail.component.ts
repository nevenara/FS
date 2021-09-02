import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  flipped = false;
  imgSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkL8GlKZ775j3f0VVgS1rU8L2LoX5UEM6fKv_eGLzeza27WYH"

  flipIt() {
    this.flipped = !this.flipped;
  }


  public show:boolean = true;
  public hide:boolean = false;
  public buttonName:any = 'Show Terms of Event';

  constructor(private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(data => {
      console.log(data['id']);
    });
  }

  toggle() {
    this.show = !this.show;
    this.hide = !this.hide;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Show Terms of Event";

      
    else
      this.buttonName = "Show Front";

  }

}
