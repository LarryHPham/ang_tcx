import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeStyle} from '@angular/platform-browser';
import { Router} from '@angular/router';

import { GlobalFunctions } from '../../../global/global-functions';
import { GlobalSettings } from '../../../global/global-settings';
import { VerticalGlobalFunctions } from '../../../global/vertical-global-functions';

//pipes
import { NaValuePipe } from "../../pipes/na.pipe";

// Interfaces
import { CircleImageData } from "../../interfaces/image-data";
import { Season, Conference, Division, SportPageParameters } from "../../interfaces/global-interface";
export interface DataItem {
  label: string;
  labelCont?: string;
  value: any; //values can be stats, age or class
  routerLink?: Array<any>;
}
export interface IProfileData {
  profileName: string;
  profileId: string;
  profileType: string; // for MLB, this is 'team', 'player', or 'league'
}

export interface ProfileHeaderData {
  profileName: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  profileTitleFirstPart: string;
  profileTitleLastPart: string;
  lastUpdatedDate: string;
  description: string;
  topDataPoints: Array<DataItem>
  bottomDataPoints: Array<DataItem>;
}

export interface PlayerProfileData extends IProfileData {
  pageParams: SportPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: PlayerProfileHeaderData
}
export interface PlayerProfileHeaderData {
  // Basic Info
    id: string;
    playerId: number;
    playerFirstName: string;
    playerLastName: string;
    playerFullName: string;
    playerBirthCity: string;
    playerBirthState: string;
    playerBirthCountry: string;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamFullName: string;
    divisionName: Division;
    conferenceName: Conference;
    division: string;
    conference: string;
    jerseyNumber: number;
    position: Array<string>;
    gamesPlayed: number;
    gamesStarted: number;
    experience: number;
    entryDate?: string;
    age: number;
    dob: string;
    height: string;
    weight: number;
    playerHeadshotUrl?: string;
    backgroundUrl?: string;
    profileHeaderUrl?: string;
    seasonId: string;
    lastUpdated: string;
    description: string;

    //NCAA specific
    class?: string;
    draftYear?: string;
    draftTeam?: string;

  //Stats
    stat1: any;
    stat1Type: string;
    stat1Desc: string;
    stat2: any;
    stat2Type: string;
    stat2Desc: string;
    stat3: any;
    stat3Type: string;
    stat3Desc: string;
    stat4: any;
    stat4Type: string;
    stat4Desc: string;
}

export interface TeamProfileData extends IProfileData {
  pageParams: SportPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: TeamProfileHeaderData;
  /**
   * @deprecated use profileName instead
   */
  teamName: string; //same as profileName
}
export interface TeamProfileHeaderData {
    id: number;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamCity: string;
    teamState: string;
    divisionName: Division;
    conferenceName: Conference;
    venueName: string;
    rank: number;
    divWins?: number;
    divLosses?: number;
    divRecord: string;
    totalWins?: number;
    totalLosses?: number;
    leagueRecord: string;
    pointsPerGame: number;
    pointsPerGameRank: number;
    passingYardsPerGame: number;
    passingYardsPerGameRank: number;
    rushingYardsPerGame: number;
    rushingYardsPerGameRank: number;
    backgroundUrl?: string;
    profileHeaderUrl?: string;
    teamLogo: string;
    profileImage: string; //todo - missing
    seasonId: string;
    lastUpdated: string;
}

export interface LeagueProfileData extends IProfileData {
  headerData: LeagueProfileHeaderData;
}
export interface LeagueProfileHeaderData {
  id: string;
  leagueFullName: string;
  leagueAbbreviatedName?: string; //todo - null
  leagueCity: string;
  leagueState: string;
  leagueFounded: string;
  totalTeams: number;
  totalPlayers: number;
  totalDivisions: number;
  totalConferences: number;
  backgroundUrl: string;
  profileHeaderUrl?: string;
  leagueLogo: string;
  aiDescriptionId: string;
  seasonId: string;
  lastUpdated: string;
}

@Component({
    selector: 'profile-header',
    templateUrl: './app/fe-core/modules/profile-header/profile-header.module.html'
})

export class ProfileHeaderModule implements OnChanges {
  @Input() profileHeaderData: ProfileHeaderData;
  @Input() profileType: string;

  public contentTitle: string = "Quick info";
  public displayDate: string;
  public profileTitle: string;
  public backgroundImage: SafeStyle;
  public imageConfig: CircleImageData = {
    imageClass: "image-180",
    mainImage: {
      imageClass: "border-large",
      placeholderImageUrl: ""
    }
  };
  public logoConfig: CircleImageData = {
    imageClass: "image-40",
      mainImage: {
        imageClass: "",
        imageUrl: GlobalSettings.getSiteLogoUrl(),
        placeholderImageUrl: GlobalSettings.getSiteLogoUrl()
      }
  };

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnChanges() {
      var data = this.profileHeaderData;

      if ( data ) {
        if ( !data.backgroundImageUrl ) {
          VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data.backgroundImageUrl);
        }
        if ( !data.profileImageUrl ) {
          data.profileImageUrl = "/app/public/no-image.svg";
        }
        this.imageConfig.mainImage.imageUrl = data.profileImageUrl;
        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url("+data.backgroundImageUrl+")");
        this.profileTitle = data.profileTitleFirstPart + "<span class='text-heavy'> " + data.profileTitleLastPart + "</span>";
        this.displayDate = GlobalFunctions.formatUpdatedDate(data.lastUpdatedDate);

        data.description = "<div class=\"ph-content-desc-border\"></div>" + data.description;
        if(this.profileType == "team"){
          this.contentTitle = "Quick info about the " + data.profileName;
        }else{
          this.contentTitle = "Quick info about " + data.profileName;
        }
      }
    }
}
