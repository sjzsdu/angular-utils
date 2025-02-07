import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzCollapseModule,
    NzIconModule,
    NzSpaceModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'event-trader';

  iconTune = {
    nzType: 'tune',
    nzTheme: 'outline' as const,
  };

  iconAccountBalance = {
    nzType: 'account-book',
    nzTheme: 'outline' as const,
  };

  iconShowChart = {
    nzType: 'line-chart',
    nzTheme: 'outline' as const,
  };
}
