export enum Season { regularSeason, postSeason }//TODO - regularSeason, postSeason
export enum Conference { AFC, NFC, ACC, AmericanAthletic, BigTen, ConferenceUSA, MidAmerican, MountainWest, Pac12, SEC, Big12, IAIndependents, SunBelt} //to get string value: Conference[myValue], where myValues is a Conference value

export enum Division { AFCEast, AFCNorth, AFCSouth, AFCWest, NFCEast, NFCNorth, NFCSouth, NFCWest, ATLANTIC, COASTAL, EAST, WEST, East, West, MOUNTAIN, NORTH, SOUTH, Big12, IAIndependents, SunBelt }  //to get string value: Year[myValue], where myValues is a Year value

export interface SportPageParameters {
  conference?: Conference;
  division?: Division;
  year?: number;
  season?: Season;
  teamId?: number;
  playerId? :number;
  type?: string;
  scope?: string;
}

export interface Link {
  route?: Array<any>;
  text: string;
  class?: string;
  active?: boolean;
}

export interface ParagraphItem {
    class?: string;
    style?: any;
    textData?: Array<Link | string>;
}

export interface NavigationData {
  title: string;
  links: Array<Link>;
  active?: boolean;
  moreLink?: Link;
}

export interface Images {
    imageUrl: string;
    imageDescription: string;
    imageCopyright: string;
    image_date: string;
    image_height: string;
    image_width: string;
    team_name: string;
    team_id: string;
}

/*BELOW IS ARTICLE MODULE TEST INTERFACE*/

export interface HeadlineData {
    event: number;
    displayHeadline: string;
    metaHeadline: string;
    dateline: string;
    article: string;
    commentHeader: string;
    leftColumn: {
        "about-the-teams": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "historical-team-statistics": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "last-matchup": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "starting-lineup-home": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "starting-lineup-away": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "injuries-home": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "injuries-away": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "upcoming-game": {
            displayHeadline: string;
            metaHeadline: string;
        };
    };
    rightColumn: {
        "pitcher-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "catcher-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "first-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "second-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "third-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "shortstop-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "left-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "center-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "right-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
    };
    home: {
        id: number;
        location: string;
        name: string;
        hex: string;
        logo: string;
        images: string;
        wins: number;
        losses: number;
    }
    away: {
        id: number;
        location: string;
        name: string;
        hex: string;
        logo: string;
        images: string;
        wins: number;
        losses: number;
    }
}

export interface Article {
    data: {
        affiliation?: string;
        article_subtype_id?: string;
        json_url?: string;
        article_type_id?: string;
        event_id?: string;
        id?: string;
        last_updated?: string;
        season_id?: string;
        teaser?: string;
        title?: string;
    }
}

export interface ArticleData {
    displayHeadline?: string;
    metaHeadline?: string;
    dateline?: string;
    article?: string;
    commentHeader?: string;
}

export interface ArticleData {
    metaData: Array<{
        homeTeamId: string;
        awayTeamId: string;
        league: string;
        homeTeamName: string;
        awayTeamName: string;
        homeRecord: string;
        awayRecord: string;
        gameAlignment: string;
        startDateTime: string;
        hex: {
            homeColor: string;
            awayColor: string;
        }
        logos: {
            home: string;
            away: string;
        }
    }>;
    preGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    midGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    postGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport3: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport5: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport7: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    aboutTheTeams: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    historicalTeamStats: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    lastMatchUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    startingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldLF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldCF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldRF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield3B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infieldSS: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield2B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield1B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    pitcher: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    catcher: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    homeTeamInjuryReport: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    awayTeamInjuryReport: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    homeTeamStartingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    awayTeamStartingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
}
/*ABOVE IS ARTICLE MODULE TEST INTERFACE*/
