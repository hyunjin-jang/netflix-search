import { useLocation } from "react-router";
import { getSearch, ISearch } from "../api";
import styled from "styled-components";
import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding: 10vw;
  padding-top: 100px;
  height: 100%;
  min-height: 100vh;
  width: 100%;
`;

const Row = styled(motion.div)`
  position: relative;
  top: 39%;
  left: 0;
  margin: -0.3rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const NoSearchData = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 8rem;
  width: 100%;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 500;
  color: white;
`;

const Slider = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
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

function Search() {
  const [searchData, setSearchData] = useState<ISearch | null>(null);
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  useEffect(() => {
    (async () => {
      if (keyword) {
        const searchData = await getSearch(keyword);
        setSearchData(searchData);
      }
    })();
  }, [keyword]);

  return (
    <Wrapper>
      {searchData ? (
        searchData.results.length > 0 ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              height: "100%",
              width: "80vw",
              // background: "blue",
              flexWrap: "wrap",
            }}
          >
            {searchData.results.map((data) => {
              return (
                <div>
                  <div
                    style={{
                      height: "200px",
                      width: "150px",
                      background: "white",
                      margin: "10px",
                      backgroundImage: `url(${makeImagePath(
                        data.backdrop_path ||
                          data.poster_path ||
                          (data.known_for && data.known_for.length > 0
                            ? data.known_for[0].backdrop_path
                            : "")
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  />
                  {data.name ? (
                    <h3 style={{ color: "white" }}>
                      {data.name.slice(0, 15)}
                      {data.name.length < 15 ? "..." : ""}
                    </h3>
                  ) : (
                    <h3 style={{ color: "white" }}>
                      {data.title.slice(0, 15)}
                    </h3>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <NoSearchData
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            데이터 없음{" "}
          </NoSearchData>
        )
      ) : (
        <div>Loading</div>
      )}
    </Wrapper>
  );
}
export default Search;
