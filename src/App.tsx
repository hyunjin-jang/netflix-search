import { Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:tvId" element={<Tv />}></Route>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
