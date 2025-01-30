import { Component, OnInit } from '@angular/core';
import { eachDayOfInterval } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less'],
  imports: [NzDatePickerModule],
})
export class WelcomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onChange(e: any) {
    console.log('adf', e);
  }
}
