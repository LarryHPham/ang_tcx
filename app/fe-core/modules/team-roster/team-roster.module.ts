import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import { ModuleHeaderData } from '../../components/module-header/module-header.component';
import { ModuleFooterData } from '../../components/module-footer/module-footer.component';
import { RosterTabData } from "../../components/roster/roster.component";

export interface RosterModuleData<T> {
  moduleTitle: string;
  moduleIdentifier: string;
  /**
    * Used for the link in the footer button
    */
  pageRouterLink: Array<any>;

  /**
   * Sent to Roster component
   */
  tabs: Array<RosterTabData<T>>;
}

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/fe-core/modules/team-roster/team-roster.module.html',
})

export class TeamRosterModule implements OnChanges {
  @Input() data: RosterModuleData<any>;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    moduleIdentifier: "",
    hasIcon: false,
    iconClass: ""
  };

  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full team roster?",
    text: "VIEW FULL ROSTER",
    url: ['Team-roster-page']
  };

  ngOnChanges() {
    if ( !this.data ) {
      this.headerInfo.moduleTitle = "Team Roster";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
      this.headerInfo.moduleIdentifier = this.data.moduleIdentifier;
      this.footerInfo.url = this.data.pageRouterLink;
    }
  }
}
