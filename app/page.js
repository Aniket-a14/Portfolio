"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useTransition,
  useRef,
} from "react";
import Loader from "./Loader";
import Navbar from "./Components/Navbar";
import Body from "./Components/Body";
import MiniLoader from "../components/ui/Miniloader";
import Comments from "./Components/Comments";

const About = lazy(() => import("./Components/About"));
const Languages = lazy(() => import("./Components/Languages"));
const Project = lazy(() => import("./Components/Project"));

const App = () => {
  const [showContent, setShowContent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      startTransition(() => setShowContent(true));
    }, 4900);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative transition-colors duration-1000">
      {!showContent && <Loader aria-hidden="true" />}

      <div
        className={`transition-opacity transform duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <div className="pt-[4rem] min-h-screen overflow-auto">
          <Body />
        </div>

        <div className="bg-[#040407] min-h-[300px]">
          <Suspense fallback={<MiniLoader />}>
            <About />
          </Suspense>
        </div>

        <div className="overflow-auto bg-[#040407] min-h-[300px]">
          <Suspense fallback={<MiniLoader />}>
            <Languages />
          </Suspense>
        </div>

        <div className="bg-[#040407] transition-colors duration-1000 min-h-[300px]">
          <Suspense fallback={<MiniLoader />}>
            <Project />
          </Suspense>
        </div>
      </div>
      <div className="bg-[#040407] min-h-[800px]">
        <Suspense fallback={<MiniLoader />}>
          <Comments />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
