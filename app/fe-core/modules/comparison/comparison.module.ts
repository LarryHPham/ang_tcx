import { Component, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';

//interfaces
import { ModuleHeaderData } from '../../components/module-header/module-header.component';
import { ComparisonTileInput} from '../../components/comparison-tile/comparison-tile.component';
import { ComparisonBarInput } from '../../components/comparison-bar/comparison-bar.component'
import { ComparisonLegendInput } from '../../components/comparison-legend/comparison-legend.component';
import { Tabs } from '../../components/tabs/tabs.component';
import { Tab } from '../../components/tabs/tab.component';
import { SportPageParameters } from '../../../global/global-interface';
import { ComparisonStatsData, PlayerData, SeasonStats } from '../../../services/comparison-stats.service';
import { Gradient } from '../../../global/global-gradient'



export interface ComparisonTabData {
    tabTitle: string;
    seasonId: string;
    barData: Array<ComparisonBarInput>;
}

export interface ComparisonModuleData {
    data: ComparisonStatsData;

    teamList: Array<{key: string, value: string}>;

    playerLists: Array<{
      teamId: string,
      playerList: Array<{key: string, value: string}>
    }>;

    loadTeamList(listLoaded: Function);

    loadPlayerList(index: number, teamId: string, listLoaded: Function);

    loadPlayer(index: number, teamId: string, playerId: string, statsLoaded: Function);
}

@Component({
    selector: 'comparison-module',
    templateUrl: './app/fe-core/modules/comparison/comparison.module.html'
})

export class ComparisonModule implements OnInit, OnChanges {
    @Input() modelData: ComparisonModuleData;

    @Input() profileName: string;

    @Input() profileId: string;

    @Input() profileType: string;

    @Input() scope: string;
    teamOnePlayerList: Array<{key: string, value: string}>;

    teamTwoPlayerList: Array<{key: string, value: string}>;

    teamList: Array<{key: string, value: string}>;

    gradient: any;

    moduleHeaderData: ModuleHeaderData = {
        moduleTitle: 'Comparison vs. Competition - [Batter Name]',
        hasIcon: false,
        iconClass: ''
    };

    comparisonLegendData: ComparisonLegendInput;

    selectedTeamOne: string;

    selectedTeamTwo: string;

    comparisonTileDataOne: ComparisonTileInput;

    comparisonTileDataTwo: ComparisonTileInput;

    tabs: Array<ComparisonTabData> = [];

    noDataMessage = "Sorry, there are no values for this season.";

    selectedTabTitle: string;

    constructor() {
        var year = new Date().getFullYear();
        this.tabs.push({
            tabTitle: "Current Season",
            seasonId: year.toString(),
            barData: []
        });
        for ( var i = 0; i < 3; i++ ) {
            year--;
            this.tabs.push({
                tabTitle: year.toString(),
                seasonId: year.toString(),
                barData: []
            });
        }
        this.tabs.push({
            tabTitle: "Career Stats",
            seasonId: "career",
            barData: []
        });
    }

    ngOnInit(){}

    ngOnChanges() {
        if ( this.modelData ) {
            this.teamList = this.modelData.teamList;
            if ( this.modelData.playerLists && this.modelData.playerLists.length >= 2 ) {
                this.teamOnePlayerList = this.modelData.playerLists[0].playerList;
                this.teamTwoPlayerList = this.modelData.playerLists[1].playerList;
            }
            if ( this.modelData.data && this.tabs ) {
                this.formatData(this.modelData.data);
                this.modelData.loadTeamList(teamList => {
                    this.teamList = teamList;
                    this.loadPlayerList(0, this.modelData.data.playerOne.teamId);
                    this.loadPlayerList(1, this.modelData.data.playerTwo.teamId);
                });
            }
        }
        if ( this.profileName ) {
          this.moduleHeaderData = {
            moduleTitle: "Comparison vs. Competition",
            moduleIdentifier: " - " + this.profileName,
            hasIcon: false,
            iconClass: '',
          }
        }
    }

    //TODO-CJP: think about passing of data and creating a list of players rather than player one and player two
    formatData(data: ComparisonStatsData) {
        this.comparisonTileDataOne = this.setupTile(data.playerOne);
        this.comparisonTileDataTwo = this.setupTile(data.playerTwo);
        this.gradient = Gradient.getGradientStyles([data.playerOne.mainTeamColor, data.playerTwo.mainTeamColor], 1);

        var selectedTab;
        for ( var i = 0; i < this.tabs.length; i++ ) {
            if ( !this.selectedTabTitle && i == 0 ) {
                selectedTab = this.tabs[i];
            }
            else if ( this.selectedTabTitle && this.tabs[i].tabTitle == this.selectedTabTitle ) {
                selectedTab = this.tabs[i];
            }
            this.tabs[i].barData = data.bars[this.tabs[i].seasonId];
        }

        if ( !selectedTab ) {
            return;
        }

        var legendTitle = selectedTab.tabTitle == "Career Stats" ? selectedTab.tabTitle : selectedTab.seasonId + " Season";
        this.comparisonLegendData = {
            legendTitle: [
                {
                    text: legendTitle,
                    class: 'text-heavy'
                },
                {
                    text: ' Breakdown',
                },
                {
                    text: '*Qualified players only',
                    class: 'comparison-legend-title-sub'
                }
            ],
            legendValues: [
                {
                    title: data.playerOne.playerFirstName != null && data.playerOne.playerLastName != null ? data.playerOne.playerFirstName + ' ' + data.playerOne.playerLastName : 'N/A',
                    // color: data.playerOne.mainTeamColor
                    color: '#2D3E50'
                },
                {
                    title: data.playerTwo.playerFirstName != null && data.playerTwo.playerLastName != null ? data.playerTwo.playerFirstName + ' ' + data.playerTwo.playerLastName : 'N/A',
                    // color: data.playerTwo.mainTeamColor
                    color: '#999999'
                },
                {
                    title: "Stat High",
                    color: "#E1E1E1"
                },
            ]
        };
    }

    setupTile(player: PlayerData): ComparisonTileInput {
        var playerName = player.playerFirstName != null && player.playerLastName != null ? player.playerFirstName + ' ' + player.playerLastName : 'N/A';
        var teamName = player.teamMarket + ' ' + player.teamName;

        // OLD Routes
        // var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(player.teamName, playerName, player.playerId);
        // var teamRoute = VerticalGlobalFunctions.formatTeamRoute(teamName, player.teamId);
        var playerRoute = player.playerRoute;
        var teamRoute = player.teamRoute;

        var playerInfo = [];

        if(this.scope == 'fbs'){
          playerInfo = [
              {
                  data: player.height != null ? player.height : 'N/A',
                  key: 'Height'
              },
              {
                  data: player.weight != null ? player.weight + "<sup>lbs</sup>" : 'N/A',
                  key: 'Weight'
              },
              {
                  data: player.class != null ? player.class : 'N/A',
                  key: 'Class'
              }
          ];
        } else {
          playerInfo = [
              {
                  data: player.height != null ? player.height : 'N/A',
                  key: 'Height'
              },
              {
                  data: player.weight != null ? player.weight + "<sup>lbs</sup>" : 'N/A',
                  key: 'Weight'
              },
              {
                  data: player.age != null ? player.age : 'N/A',
                  key: 'Age'
              },
              {
                  data: player.yearExperience != null ? player.yearExperience : 'N/A',
                  key: player.yearExperience == '1' ? 'Year' : 'Years'
              },
          ];
        }
        return {
            dropdownOneKey: player.teamId,
            dropdownTwoKey: player.playerId,
            imageConfig: {
                imageClass: "image-res",
                mainImage: {
                    imageUrl: player.playerHeadshot,
                    urlRouteArray: playerRoute,
                    hoverText: "<p>View</p><p>Profile</p>",
                    imageClass: "border-med"
                },
                subImages: [
                    // {
                        // imageUrl: GlobalSettings.getImageUrl(player.teamLogo),
                        // urlRouteArray: VerticalGlobalFunctions.formatTeamRoute(player.teamName, player.teamId),
                        // hoverText: "<i class='fa fa-mail-forward'></i>",
                        // imageClass: "image-50-sub image-round-lower-right"
                    // },
                    {
                        text: player.jerseyNumber ? "#" + player.jerseyNumber : 'N/A',
                        imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                    }
                ],
            },
            titleUrl: playerRoute,
            title: playerName,
            description: ["Position: ",
                { text: player.playerPosition ? player.playerPosition : 'N/A', class: 'text-heavy' },
                { text: "<br>", class: "line-break" },
                "Team: ",
                {
                    text: player.teamAbbreviation != null && player.teamName != null ? player.teamAbbreviation + ' ' + player.teamName : 'N/A',
                    route: teamRoute,
                    class: 'text-heavy'
                }
            ],
            data: playerInfo
        }
    }

    /**
     * @param {number} tileIndex - 0 : left tile
     *                           - 1 : right tile
     * @param value an object containing
     *  - {number} dropdownIndex: 0 = left dropdown or team list, 1 right dropdown or player list
     *  - {string} key - The key selected in the dropdown
     */
    tileDropdownSwitched(tileIndex:number, value) {
        var dropdownIndex:number = value.dropdownIndex;
        var key:string = value.key;
        if ( dropdownIndex == 0 ) { //team dropdown
            this.loadPlayerList(tileIndex, key);
            this.loadPlayer(tileIndex, key);
        }
        else if ( dropdownIndex == 1 ) { //player dropdown
            //load new player list and comparison stats
            this.loadPlayer(tileIndex, null, key);
        }
    }

    loadPlayerList(tileIndex:number, teamId: string) {
        if ( tileIndex == 0 ) {
            this.selectedTeamOne = teamId;
        }
        else {
            this.selectedTeamTwo = teamId;
        }
        this.modelData.loadPlayerList(tileIndex, teamId, playerList => {
            if ( tileIndex == 0 ) {
                this.teamOnePlayerList = playerList;
            }
            else {
                this.teamTwoPlayerList = playerList;
            }
        });
    }

    loadPlayer(tileIndex: number, teamId: string, playerId?: string) {
        this.modelData.loadPlayer(tileIndex, teamId, playerId, (bars) => {
            this.modelData.data.bars = bars;
            this.formatData(this.modelData.data);
        });
    }

    tabSelected(tabTitle) {
        this.selectedTabTitle = tabTitle;
        var selectedTabs = this.tabs.filter(tab => {
           return tab.tabTitle == tabTitle;
        });
        if ( selectedTabs.length > 0 ) {
            var tab = selectedTabs[0];
            if ( tabTitle == "Career Stats" ) {
                this.comparisonLegendData.legendTitle[0].text = tabTitle;
                this.noDataMessage = "Sorry, there are no career stats available for these players.";
            }
            else {
                this.comparisonLegendData.legendTitle[0].text = tab.seasonId + " Season";
                this.noDataMessage = "Sorry, there are no statistics available for " + tab.seasonId + ".";
            }
        }
    }
}
