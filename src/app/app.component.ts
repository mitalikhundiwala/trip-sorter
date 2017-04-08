import { DealsService } from './services/deals.service';
import { Deal } from './models/deal';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  deals: Deal[] = [];

  constructor(
    private _dealsService: DealsService
  ) {
    this._dealsService.fetchDeals()
      .subscribe((deals) => {
        this.deals = deals;
        debugger;
      });
  }
}
