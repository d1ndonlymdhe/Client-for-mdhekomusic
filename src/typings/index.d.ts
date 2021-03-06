type IconProps = {
  iconName: string;
  onClick?: JsxAttribute;
};
type Thumbnail = {
  url: string;
  width: string;
  height: string;
};
type Result = {
  title: string;
  videoUrl: string;
  channel: string;
  thumbnail: Thumbnail;
};
type searchProps = {
  searchResults: Result[];
  setSearchResult: React.Dispatch<React.SetStateAction<Result[]>>;
  // setShowResults:React.Dispatch<React.SetStateAction<Boolean>>
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
};
type RenderSearchResultProps = {
  searchResults: Result[];
  setCurrentSong: React.Dispatch<React.SetStateAction<string>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUrl: React.Dispatch<React.SetStateAction<string>>;
  setLoadHowl: React.Dispatch<React.SetStateAction<boolean>>;
  setQueue: React.Dispatch<React.SetStateAction<Result[]>>;
};

type ActiveTabProps = {
  extraClass: string;
  children: React.ReactNode | React.ReactNode[];
};
type MusicControlProps = {
  songName: string;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
};
type BackDropForIConProps = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: JsxAttribute;
};

type sideBarProps = {
  setIsSearchTabActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQTabActive: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

type queueProps = {
  queue: Result[];
  setCurrentSong: React.Dispatch<React.SetStateAction<string>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUrl: React.Dispatch<React.SetStateAction<string>>;
  setLoadHowl: React.Dispatch<React.SetStateAction<boolean>>;
  setQueue: React.Dispatch<React.SetStateAction<Result[]>>;
  currentUrl: string;
};

type renderHowlerProps = {
  current: string;
  urlQueue: string[];
};
