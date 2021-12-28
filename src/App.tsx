import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
//@ts-ignore
import uuid from "react-uuid";
import "./App.css";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from "@fluentui/react";
initializeIcons();
const SearchIcon = () => {
  return <Icon iconName="Search"></Icon>;
};

const CreateIcon = (props: IconProps) => {
  return (
    <div className="iconWrapper" onClick={props.onClick}>
      <Icon iconName={props.iconName}></Icon>
    </div>
  );
};

const server = "https://mdhekomusic.herokuapp.com";

function App() {
  const [isSearchTabACtive] = useState(true);
  // setIsSearchTabActive(true);
  const [loadHowl, setLoadHowl] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([
    {
      title: "",
      videoUrl: "",
      channel: "",
      thumbnail: {
        url: "",
        width: "",
        height: "",
      },
    },
  ]);
  const [showResults, setShowResults] = useState(false);
  const [currentSong, setCurrentSong] = useState("No Song Playing");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isPaused, setIsPaused] = useState(true);
  // const [howl,setHowl] = useState<Howl|null>(null);
  const searchProps: searchProps = {
    searchResults,
    setSearchResult: setSearchResults,
    setShowResults,
  };
  const RenderSearchResultProps: RenderSearchResultProps = {
    searchResults,
    setCurrentSong,
    setIsPaused,
    setCurrentUrl,
    setLoadHowl,
  };
  const ActiveTabProps = { extraClass: "searchTab " };
  const MusicControlProps: MusicControlProps = {
    songName: currentSong,
    isPaused,
    setIsPaused,
  };
  return (
    <>
      <div id="app">
        <SideBar></SideBar>
        {isSearchTabACtive && (
          <ActiveTab {...ActiveTabProps}>
            <Search {...searchProps}></Search>
            <MusicControl {...MusicControlProps}></MusicControl>
            {showResults && (
              <RenderSearchResult
                {...RenderSearchResultProps}
              ></RenderSearchResult>
            )}
          </ActiveTab>
        )}
      </div>
      {loadHowl && (
        <ReactHowler
          src={currentUrl}
          format={["mp3"]}
          playing={!isPaused}
        ></ReactHowler>
      )}
    </>
  );
}

function SideBar() {
  return (
    <div className="sidebar">
      <div id="searchIcon">
        <BackdropForIcons>
          <SearchIcon></SearchIcon>
        </BackdropForIcons>
      </div>
    </div>
  );
}

function BackdropForIcons(props: BackDropForIConProps) {
  return (
    <div className="backdropForIcons" onClick={props.onClick}>
      {props.children}
    </div>
  );
}

function ActiveTab(props: ActiveTabProps) {
  const { extraClass } = props;
  return <div className={`activeTab ${extraClass}`}>{props.children}</div>;
}

function Search(props: searchProps) {
  const { setSearchResult, setShowResults } = props;
  const [isSearching, setIsSearching] = useState(false);
  const searchTermref = useRef<HTMLInputElement>(null);
  function handleSearchSubmit() {
    fetch(`${server}/search?searchTerm=${searchTermref.current?.value}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setIsSearching(false);
        console.log(data);
        setSearchResult(data);
        setShowResults(true);
      });
  }
  return (
    <div id="search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSearching(true);
          handleSearchSubmit();
        }}
        id="searchForm"
      >
        <input
          type="text"
          name="searchTerm"
          ref={searchTermref}
          className="searchInput"
        ></input>
        <div id="submitSearchWrapper">
          <button type="submit" className="button submitSearch">
            <SearchIcon></SearchIcon>
          </button>
        </div>
        {isSearching && <p>Loading</p>}
      </form>
    </div>
  );
}

function RenderSearchResult(props: RenderSearchResultProps) {
  const {
    searchResults,
    setCurrentSong,
    setIsPaused,
    setCurrentUrl,
    setLoadHowl,
  } = props;
  // function play(videoUrl: string) {
  //   const song = new Howl({
  //     src: `${server}/song?url=${videoUrl}`,
  //     format: ["mp3"],
  //   });
  //   song.play();
  // }
  return (
    <div id="searchResults">
      {searchResults.map((result) => {
        const { title, videoUrl, thumbnail } = result;
        return (
          <div
            className="result card"
            onClick={(e) => {
              setCurrentSong(title);
              setCurrentUrl(`${server}/song?url=${videoUrl}`);
              setLoadHowl(true);
              // play(videoUrl);
              setIsPaused(false);
            }}
            key={uuid()}
          >
            <img src={thumbnail.url} className="thumbnail" alt={title}></img>
            <span>{title}</span>
          </div>
        );
      })}
    </div>
  );
}

function MusicControl(props: MusicControlProps) {
  let middleButton;

  if (props.isPaused === true) {
    middleButton = "Play";
  } else {
    middleButton = "Pause";
  }
  return (
    <div id="musicControl">
      <div id="songName">{props.songName}</div>
      <div id="controllers">
        <BackdropForIcons>
          <CreateIcon iconName="Previous"></CreateIcon>
        </BackdropForIcons>
        <BackdropForIcons
          onClick={() => {
            props.setIsPaused(!props.isPaused);
          }}
        >
          <CreateIcon iconName={middleButton}></CreateIcon>
        </BackdropForIcons>
        <BackdropForIcons>
          <CreateIcon iconName="Next"></CreateIcon>
        </BackdropForIcons>
      </div>
    </div>
  );
}

export default App;
