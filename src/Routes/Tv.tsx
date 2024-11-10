import styled from "styled-components";
import {
  getNowTv,
  getTopRatedTv,
  getUpcomingTv,
  IGetMoviesResult,
} from "../api";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  color: white;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
  color: white;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px; /* 슬라이더 사이 간격 */
  padding: 20px; /* 컨테이너 전체 패딩 */
`;

const Slider = styled.div`
  position: relative;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 50px;
  color: white;
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 0.7;
  }
`;

const LeftArrow = styled(Arrow)`
  left: 10px;
`;

const RightArrow = styled(Arrow)`
  right: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: relative;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    color: white;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 0px 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Tv() {
  const navigate = useNavigate();
  const tvId = useParams();
  const { scrollY } = useViewportScroll();

  const { data: now, isLoading } = useQuery<IGetMoviesResult>(
    ["tv", "nowPlaying"],
    getNowTv
  );
  const { data: rated } = useQuery<IGetMoviesResult>(
    ["tv", "topRated"],
    getTopRatedTv
  );
  const { data: upcoming } = useQuery<IGetMoviesResult>(
    ["tv", "upcoming"],
    getUpcomingTv
  );

  const [nowIndex, setNowIndex] = useState(0);
  const [ratedIndex, setRatedIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);

  const increaseIndex = (
    slider: string,
    data: IGetMoviesResult | undefined
  ) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (slider === "now") {
        setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (slider === "rated") {
        setRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (slider === "upcoming") {
        setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const decreaseIndex = (
    slider: string,
    data: IGetMoviesResult | undefined
  ) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (slider === "now") {
        setNowIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else if (slider === "rated") {
        setRatedIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else if (slider === "upcoming") {
        setUpcomingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: string) => {
    navigate(`/tv/${movieId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedMovie =
    tvId.tvId &&
    now?.results.find((movie) => movie.id === Number(tvId.tvId?.split("=")[1]));

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            // onClick={() => increaseIndex("now", now)}
            bgPhoto={makeImagePath(upcoming?.results[0].backdrop_path || "")}
          >
            <Title>{now?.results[0].title}</Title>
            <Overview>{now?.results[0].overview}</Overview>
          </Banner>

          <SliderContainer>
            {[
              { data: now, title: "Now Playing", index: nowIndex, key: "now" },
              {
                data: rated,
                title: "Top Rated",
                index: ratedIndex,
                key: "rated",
              },
              {
                data: upcoming,
                title: "Upcoming",
                index: upcomingIndex,
                key: "upcoming",
              },
            ].map(({ data, title, index, key }) => (
              <Slider key={key}>
                <h2 style={{ color: "white", marginBottom: "1rem" }}>
                  {title}
                </h2>
                <LeftArrow onClick={() => decreaseIndex(key, data)}>
                  &#8249;
                </LeftArrow>
                <RightArrow onClick={() => increaseIndex(key, data)}>
                  &#8250;
                </RightArrow>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                  >
                    {data?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((tv) => (
                        <Box
                          layoutId={`${key}=${tv.id}`}
                          key={tv.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(`${key}=${tv.id}`)}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            ))}
          </SliderContainer>
          <AnimatePresence>
            {tvId.tvId ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={tvId.tvId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.poster_path,
                            "w200"
                          )})`,
                          height: "200px",
                          width: "120px",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 0,
                        }}
                      />
                      <div style={{ position: "relative", top: "14vh" }}>
                        <BigTitle>
                          {clickedMovie.title || clickedMovie.name}
                        </BigTitle>
                        <BigOverview style={{ paddingBottom: "10px" }}>
                          ⭐️{clickedMovie.vote_average}
                        </BigOverview>
                        <BigOverview
                          style={{
                            height: "100px",
                            overflow: "auto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {clickedMovie.overview}
                        </BigOverview>
                      </div>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
