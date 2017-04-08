import { Component, OnInit, Input } from '@angular/core';
import { Deal } from '../../models/deal';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.scss']
})
export class DealListComponent implements OnInit {

  private _deals: Deal[];
  @Input() set deals(value: Deal[]) {
    if (value) {
      this._deals = value;
    }
  }

  get deals(): Deal[] {
    return this._deals;
  }

  constructor() { }

  ngOnInit() {
  }

}
