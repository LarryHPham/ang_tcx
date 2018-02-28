import { Component, Injectable, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

//interfaces
import { ModuleFooter, ModuleFooterData } from '../../components/module-footer/module-footer.component';
import { ModuleHeader, ModuleHeaderData } from '../../components/module-header/module-header.component';
import { TransactionTabData } from '../../components/transactions/transactions.component';

export interface TransactionModuleData {
  tabs: Array<TransactionTabData>;
  ctaRoute: Array<any>;
  profileName: string;
}

@Component({
  selector: 'transactions-module',
  templateUrl: './app/fe-core/modules/transactions/transactions.module.html'
})

export class TransactionsModule {
  @Output() tabSwitched = new EventEmitter(true);
  @Output() transactionKeyFilter =  new EventEmitter();

  @Input() transactionModuleFooterParams;
  @Input() data: TransactionModuleData;
  @Input() dropdownKey1: string;
  @Input() transactionFilter1: Array<any>;

  modHeadData: ModuleHeaderData;
  footerData: ModuleFooterData;

  ngOnChanges() {
    this.footerData = {
      infoDesc: 'Want to see more transactions?',
      text: 'VIEW TRANSACTIONS',
      url: this.transactionModuleFooterParams
    };

    this.modHeadData = {
      moduleTitle: "Transactions",
      moduleIdentifier: " - "+this.data.profileName,
      hasIcon: false,
      iconClass: '',
    }
  } //ngOnChanges()

  tabSelected(tab) {
    this.tabSwitched.next(tab);
  }

  transactionFilterSelected(event) {
    this.transactionKeyFilter.next(event);
  }
}
