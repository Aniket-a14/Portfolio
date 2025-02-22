"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = React.forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={`z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamDemo() {
  const containerRef = React.useRef(null);
  const div1Ref = React.useRef(null);
  const div2Ref = React.useRef(null);
  const div3Ref = React.useRef(null);
  const div4Ref = React.useRef(null);
  const div5Ref = React.useRef(null);
  const div6Ref = React.useRef(null);
  const div7Ref = React.useRef(null);

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Icons.googleDrive />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.googleDocs />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Icons.notion />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <Icons.openai />
          </Circle>
          <Circle ref={div6Ref}>
            <Icons.zapier />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <Icons.whatsapp />
          </Circle>
          <Circle ref={div7Ref}>
            <Icons.messenger />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}

const Icons = {
  notion: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="200"
      height="200"
      viewBox="0 0 48 48"
    >
      <path
        fill="#80deea"
        d="M24,34C11.1,34,1,29.6,1,24c0-5.6,10.1-10,23-10c12.9,0,23,4.4,23,10C47,29.6,36.9,34,24,34z M24,16	c-12.6,0-21,4.1-21,8c0,3.9,8.4,8,21,8s21-4.1,21-8C45,20.1,36.6,16,24,16z"
      ></path>
      <path
        fill="#80deea"
        d="M15.1,44.6c-1,0-1.8-0.2-2.6-0.7C7.6,41.1,8.9,30.2,15.3,19l0,0c3-5.2,6.7-9.6,10.3-12.4c3.9-3,7.4-3.9,9.8-2.5	c2.5,1.4,3.4,4.9,2.8,9.8c-0.6,4.6-2.6,10-5.6,15.2c-3,5.2-6.7,9.6-10.3,12.4C19.7,43.5,17.2,44.6,15.1,44.6z M32.9,5.4	c-1.6,0-3.7,0.9-6,2.7c-3.4,2.7-6.9,6.9-9.8,11.9l0,0c-6.3,10.9-6.9,20.3-3.6,22.2c1.7,1,4.5,0.1,7.6-2.3c3.4-2.7,6.9-6.9,9.8-11.9	c2.9-5,4.8-10.1,5.4-14.4c0.5-4-0.1-6.8-1.8-7.8C34,5.6,33.5,5.4,32.9,5.4z"
      ></path>
      <path
        fill="#80deea"
        d="M33,44.6c-5,0-12.2-6.1-17.6-15.6C8.9,17.8,7.6,6.9,12.5,4.1l0,0C17.4,1.3,26.2,7.8,32.7,19	c3,5.2,5,10.6,5.6,15.2c0.7,4.9-0.3,8.3-2.8,9.8C34.7,44.4,33.9,44.6,33,44.6z M13.5,5.8c-3.3,1.9-2.7,11.3,3.6,22.2	c6.3,10.9,14.1,16.1,17.4,14.2c1.7-1,2.3-3.8,1.8-7.8c-0.6-4.3-2.5-9.4-5.4-14.4C24.6,9.1,16.8,3.9,13.5,5.8L13.5,5.8z"
      ></path>
      <circle cx="24" cy="24" r="4" fill="#80deea"></circle>
    </svg>
  ),
  openai: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  googleDrive: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#212121"
        d="M18.974,31.5c0,0.828-0.671,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-14c0-0.653,0.423-1.231,1.045-1.43 c0.625-0.198,1.302,0.03,1.679,0.563l16.777,23.704C40.617,36.709,44,30.735,44,24c0-11-9-20-20-20S4,13,4,24s9,20,20,20 c3.192,0,6.206-0.777,8.89-2.122L18.974,22.216V31.5z M28.974,16.5c0-0.828,0.671-1.5,1.5-1.5s1.5,0.672,1.5,1.5v13.84l-3-4.227 V16.5z"
      ></path>
    </svg>
  ),
  whatsapp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#0277BD"
        d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"
      ></path>
      <path
        fill="#FFC107"
        d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"
      ></path>
    </svg>
  ),
  googleDocs: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <linearGradient
        id="Ey3AfYdg0JtJGx7I73Eu7a_TpULddJc4gTh_gr1"
        x1="5"
        x2="43"
        y1="24"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".002" stop-color="#427fdb"></stop>
        <stop offset=".397" stop-color="#2668cb"></stop>
        <stop offset=".763" stop-color="#1358bf"></stop>
        <stop offset="1" stop-color="#0c52bb"></stop>
      </linearGradient>
      <path
        fill="url(#Ey3AfYdg0JtJGx7I73Eu7a_TpULddJc4gTh_gr1)"
        fill-rule="evenodd"
        d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0	c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867	c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0	c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867	c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z"
        clip-rule="evenodd"
      ></path>
      <linearGradient
        id="Ey3AfYdg0JtJGx7I73Eu7b_TpULddJc4gTh_gr2"
        x1="5"
        x2="42.487"
        y1="18.702"
        y2="18.702"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#32bdef"></stop>
        <stop offset="1" stop-color="#1ea2e4"></stop>
      </linearGradient>
      <path
        fill="url(#Ey3AfYdg0JtJGx7I73Eu7b_TpULddJc4gTh_gr2)"
        fill-rule="evenodd"
        d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836	c3.343-1.872,13.405-7.507,16.748-9.38c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331	c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z"
        clip-rule="evenodd"
      ></path>
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14s-14-6.273-14-14	S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z"
        clip-rule="evenodd"
      ></path>
      <linearGradient
        id="Ey3AfYdg0JtJGx7I73Eu7c_TpULddJc4gTh_gr3"
        x1="23.593"
        x2="43"
        y1="23.852"
        y2="23.852"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#2aa4f4"></stop>
        <stop offset="1" stop-color="#007ad9"></stop>
      </linearGradient>
      <path
        fill="url(#Ey3AfYdg0JtJGx7I73Eu7c_TpULddJc4gTh_gr3)"
        fill-rule="evenodd"
        d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127	L23.593,24L42.485,13.205z"
        clip-rule="evenodd"
      ></path>
      <g opacity=".05">
        <path d="M33,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H33 M34,20h-1h-2h-1v1v1h-1h-1v1v2v1h1h1v1v1h1h2h1v-1v-1h1h1v-1v-2v-1h-1h-1v-1V20 L34,20z"></path>
        <path d="M40,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H40 M41,20h-1h-2h-1v1v1h-1h-1v1v2v1h1h1v1v1h1h2h1v-1v-1h1h1v-1v-2v-1h-1h-1v-1V20 L41,20z"></path>
      </g>
      <g opacity=".07">
        <path d="M33,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H33 M33.5,20.5H33h-2h-0.5V21v1.5H29h-0.5V23v2v0.5H29h1.5V27v0.5H31h2h0.5V27v-1.5H35 h0.5V25v-2v-0.5H35h-1.5V21V20.5L33.5,20.5z"></path>
        <path d="M40,21v2h2v2h-2v2h-2v-2h-2v-2h2v-2H40 M40.5,20.5H40h-2h-0.5V21v1.5H36h-0.5V23v2v0.5H36h1.5V27v0.5H38h2h0.5V27v-1.5H42 h0.5V25v-2v-0.5H42h-1.5V21V20.5L40.5,20.5z"></path>
      </g>
      <polygon
        fill="#fff"
        points="33,21 31,21 31,23 29,23 29,25 31,25 31,27 33,27 33,25 35,25 35,23 33,23"
      ></polygon>
      <polygon
        fill="#fff"
        points="42,23 40,23 40,21 38,21 38,23 36,23 36,25 38,25 38,27 40,27 40,25 42,25"
      ></polygon>
      <g>
        <path
          d="M24,10c5.128,0,9.602,2.771,12.041,6.887l-6.073,3.47C28.737,18.347,26.527,17,24,17c-3.864,0-7,3.136-7,7 c0,3.863,3.137,7,7,7c2.57,0,4.812-1.392,6.029-3.459l6.132,3.374C33.75,35.142,29.21,38,24,38c-7.727,0-14-6.273-14-14 S16.273,10,24,10 M24,9C15.729,9,9,15.729,9,24s6.729,15,15,15c5.367,0,10.36-2.908,13.03-7.59l0.503-0.882l-0.89-0.49 l-6.132-3.374l-0.851-0.468l-0.493,0.837C28.09,28.863,26.11,30,24,30c-3.308,0-6-2.692-6-6s2.692-6,6-6 c2.099,0,4.011,1.076,5.115,2.879l0.507,0.828l0.842-0.481l6.073-3.47l0.882-0.504l-0.518-0.874C34.205,11.827,29.262,9,24,9L24,9 z"
          opacity=".05"
        ></path>
        <path
          d="M24,10c5.128,0,9.602,2.771,12.041,6.887l-6.073,3.47C28.737,18.347,26.527,17,24,17c-3.864,0-7,3.136-7,7 c0,3.863,3.137,7,7,7c2.57,0,4.812-1.392,6.029-3.459l6.132,3.374C33.75,35.142,29.21,38,24,38c-7.727,0-14-6.273-14-14 S16.273,10,24,10 M24,9.5C16.005,9.5,9.5,16.005,9.5,24S16.005,38.5,24,38.5c5.188,0,10.014-2.812,12.595-7.337l0.252-0.441 l-0.445-0.245l-6.132-3.374l-0.425-0.234l-0.246,0.418C28.431,29.269,26.286,30.5,24,30.5c-3.584,0-6.5-2.916-6.5-6.5 s2.916-6.5,6.5-6.5c2.275,0,4.346,1.166,5.542,3.118l0.253,0.414l0.421-0.241l6.073-3.47l0.441-0.252l-0.259-0.437 C33.864,12.233,29.086,9.5,24,9.5L24,9.5z"
          opacity=".07"
        ></path>
      </g>
    </svg>
  ),
  zapier: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <path
        fill="#d43a02"
        d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999	c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"
      ></path>
      <path
        fill="#d43a02"
        d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743	s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"
      ></path>
      <linearGradient
        id="P9ujQJgz7XN9Qbny9S64Ha_Pd2x9GWu9ovX_gr1"
        x1="22.677"
        x2="30.737"
        y1="21.174"
        y2="43.318"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#5c65d6"></stop>
        <stop offset=".999" stop-color="#464eb0"></stop>
      </linearGradient>
      <path
        fill="url(#P9ujQJgz7XN9Qbny9S64Ha_Pd2x9GWu9ovX_gr1)"
        d="M32.084,25.055c1.754-0.394,3.233,0.723,3.233,2.01c0,2.901-4.021,5.643-4.021,5.643 s6.225-0.742,6.225-5.505C37.521,24.053,34.464,23.266,32.084,25.055z M29.129,27.395c0,0,1.941-1.383,2.458-1.902 c-4.763,1.011-15.638,1.147-15.638,0.269c0-0.809,3.507-1.638,3.507-1.638s-7.773-0.112-7.773,2.181 C11.683,28.695,21.858,28.866,29.129,27.395z"
      ></path>
      <linearGradient
        id="P9ujQJgz7XN9Qbny9S64Hb_Pd2x9GWu9ovX_gr2"
        x1="19.498"
        x2="27.296"
        y1="22.77"
        y2="44.196"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#5c65d6"></stop>
        <stop offset=".999" stop-color="#464eb0"></stop>
      </linearGradient>
      <path
        fill="url(#P9ujQJgz7XN9Qbny9S64Hb_Pd2x9GWu9ovX_gr2)"
        d="M27.935,29.571 c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"
      ></path>
      <linearGradient
        id="P9ujQJgz7XN9Qbny9S64Hc_Pd2x9GWu9ovX_gr3"
        x1="18.698"
        x2="26.59"
        y1="23.455"
        y2="45.14"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#5c65d6"></stop>
        <stop offset=".999" stop-color="#464eb0"></stop>
      </linearGradient>
      <path
        fill="url(#P9ujQJgz7XN9Qbny9S64Hc_Pd2x9GWu9ovX_gr3)"
        d="M18.686,32.739 c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"
      ></path>
      <linearGradient
        id="P9ujQJgz7XN9Qbny9S64Hd_Pd2x9GWu9ovX_gr4"
        x1="18.03"
        x2="25.861"
        y1="24.198"
        y2="45.712"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#5c65d6"></stop>
        <stop offset=".999" stop-color="#464eb0"></stop>
      </linearGradient>
      <path
        fill="url(#P9ujQJgz7XN9Qbny9S64Hd_Pd2x9GWu9ovX_gr4)"
        d="M36.281,36.632 c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839 C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"
      ></path>
      <linearGradient
        id="P9ujQJgz7XN9Qbny9S64He_Pd2x9GWu9ovX_gr5"
        x1="20.725"
        x2="28.228"
        y1="24.582"
        y2="45.197"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#5c65d6"></stop>
        <stop offset=".999" stop-color="#464eb0"></stop>
      </linearGradient>
      <path
        fill="url(#P9ujQJgz7XN9Qbny9S64He_Pd2x9GWu9ovX_gr5)"
        d="M39,38.604 c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"
      ></path>
    </svg>
  ),
  messenger: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      color="#49562b"
      fill="none"
    >
      <path
        d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.41465 10C8.20873 9.4174 7.65311 9 7 9C6.17157 9 5.5 9.67157 5.5 10.5C5.5 11.3284 6.17157 12 7 12C7.82843 12 8.5 12.6716 8.5 13.5C8.5 14.3284 7.82843 15 7 15C6.34689 15 5.79127 14.5826 5.58535 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.5 15C11.6716 15 11 14.3284 11 13.5V10.5C11 9.67157 11.6716 9 12.5 9C13.3284 9 14 9.67157 14 10.5V13.5C14 14.3284 13.3284 15 12.5 15ZM12.5 15L14 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.5 9V13C16.5 13.9428 16.5 14.4142 16.7929 14.7071C17.0858 15 17.5572 15 18.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};
