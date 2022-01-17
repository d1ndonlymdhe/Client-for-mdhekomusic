import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
//@ts-ignore
import uuid from "react-uuid";
import "./App.css";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from "@fluentui/react";

// const queueLength = 10;

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
  const [isSearchTabACtive, setIsSearchTabActive] = useState(true);
  const [isQTabActive, setIsQTabActive] = useState(false);
  const [activeTab, setActiveTab] = useState("searchTab");
  const [loadHowl, setLoadHowl] = useState(false);
  const [queue, setQueue] = useState<Result[]>([]);
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
    setQueue,
  };
  const ActiveTabProps = { extraClass: activeTab };
  const MusicControlProps: MusicControlProps = {
    songName: currentSong,
    isPaused,
    setIsPaused,
  };
  const sideBarProps: sideBarProps = {
    setIsSearchTabActive,
    setIsQTabActive,
    setActiveTab,
  };
  const queueProps: queueProps = {
    queue,
    setQueue,
    setCurrentUrl,
    setIsPaused,
    setCurrentSong,
    setLoadHowl,
    currentUrl: currentUrl,
  };
  return (
    <>
      <div id="app">
        <SideBar {...sideBarProps}></SideBar>
        <ActiveTab {...ActiveTabProps}>
          {isSearchTabACtive && <Search {...searchProps}></Search>}
          {isQTabActive && <Queue {...queueProps}></Queue>}
          {showResults && isSearchTabACtive && (
            <RenderSearchResult
              {...RenderSearchResultProps}
            ></RenderSearchResult>
          )}
        </ActiveTab>
      </div>
      <MusicControl {...MusicControlProps}></MusicControl>
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

function SideBar(props: sideBarProps) {
  const { setIsSearchTabActive, setIsQTabActive, setActiveTab } = props;
  return (
    <div className="sidebar">
      <div
        id="searchIcon"
        onClick={() => {
          setIsSearchTabActive(true);
          setIsQTabActive(false);
          setActiveTab("searchTab");
        }}
      >
        <BackdropForIcons>
          <Icon iconName="Search"></Icon>
        </BackdropForIcons>
      </div>
      <div
        id="queueIcon"
        onClick={() => {
          setIsQTabActive(true);
          setIsSearchTabActive(false);
          setActiveTab("queue");
        }}
      >
        <BackdropForIcons>
          <Icon iconName="BulletedList"></Icon>
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
    setQueue,
  } = props;
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
              fetch(`${server}/getQueue?url=${videoUrl}`)
                .then((res) => {
                  console.log(res);
                  return res.json();
                })
                .then((data) => {
                  // console.log(data);
                  console.log(data);
                  setQueue(data);
                });
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

function Queue(props: queueProps) {
  const {
    queue,
    setQueue,
    setCurrentUrl,
    setIsPaused,
    setLoadHowl,
    setCurrentSong,
    currentUrl,
  } = props;

  return (
    <div id="searchTab">
      <div className="heading queueTitle">Queue</div>
      <div id="queue">
        {queue.map((el, index) => {
          const title = el.title;
          const thumbnail = el.thumbnail;
          const url = el.videoUrl;
          return (
            <div
              className="result card"
              key={uuid()}
              onClick={(e) => {
                const skippedSongsCount = index + 1;
                console.log(url);
                // console.log(queue.map((el) => youtube_parser(el.videoUrl)));
                const oldQueueIds = queue.map((el) =>
                  youtube_parser(el.videoUrl)
                );
                oldQueueIds.push(youtube_parser(currentUrl));
                fetch(
                  `${server}/getNext?url=${url}&length=${skippedSongsCount}&data=${JSON.stringify(
                    {
                      oldQueueIds,
                    }
                  )}`
                )
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    console.log(data);
                    let tempQueue = queue;
                    tempQueue = tempQueue.slice(index, tempQueue.length);
                    data.forEach((el: Result) => {
                      tempQueue.push(el);
                    });
                    setQueue(tempQueue);
                    setCurrentUrl(`${server}/song?url=${url}`);
                    setCurrentSong(title);
                    setLoadHowl(true);
                    setIsPaused(false);
                  });
              }}
            >
              <img src={thumbnail.url} className="thumbnail" alt={title}></img>
              <span>{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

function youtube_parser(url: string) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}
