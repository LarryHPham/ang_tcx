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
