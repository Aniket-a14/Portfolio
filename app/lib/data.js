import {
    FaLinkedin,
    FaGithub,
    FaInstagram,
    FaTwitter,
    FaFacebook,
} from "react-icons/fa";

export const heroData = {
    title: "Hello",
    subTitle: "I'm",
    roles: ["a Web Developer", "Aniket Saha", "a Software Dev"],
    description:
        "I build dynamic web apps with React and Next.js while exploring machine learning and data analysis. My projects span full-stack platforms to AI-driven solutions, aiming for efficiency and impact.",
    links: {
        react: "https://react.dev/",
        nextjs: "https://nextjs.org/",
        linkedin: "https://www.linkedin.com/in/aniketsaha2005/",
        github: "https://github.com/Aniket-a14/",
        resume: "/aniket_cv.pdf",
    },
};

export const aboutText =
    "Driven by a passion for coding and innovation, I am a tech enthusiast with a strong interest in Machine Learning and software development. I enjoy solving complex problems, exploring new technologies, and building impactful solutions. My experience spans web development to AI-driven applications, where I continuously expand my skills, optimize code, and experiment with emerging technologies.";

export const skillsSlugs = [
    "typescript",
    "javascript",
    "react",
    "html5",
    "nodedotjs",
    "express",
    "nextdotjs",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "docker",
    "git",
    "github",
    "gitlab",
    "figma",
    "mysql",
    "cplusplus",
    "pytorch",
    "tensorflow",
    "opencv",
    "pandas",
    "sqlite",
    "mongodb",
    "tailwindcss",
    "bootstrap",
    "sass",
    "jquery",
    "reactrouter",
    "redux",
];

export const socialLinks = [
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/aniketsaha2005",
        icon: FaLinkedin,
        colorClass: "group-hover:text-blue-600",
    },
    {
        name: "GitHub",
        url: "https://github.com/Aniket-a14",
        icon: FaGithub,
        colorClass: "group-hover:text-gray-600",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/aniket_a14/",
        icon: FaInstagram,
        colorClass: "group-hover:text-pink-600",
    },
    {
        name: "Facebook",
        url: "https://www.facebook.com/aniket.saha.904",
        icon: FaFacebook,
        colorClass: "group-hover:text-blue-600",
    },
    {
        name: "Twitter",
        url: "https://x.com/AniketSaha41043",
        icon: FaTwitter,
        colorClass: "group-hover:text-blue-400",
    },
];

export const codingProfiles = [
    {
        name: "Leetcode",
        url: "https://leetcode.com/u/Wizard_a14/",
        stats: "- 450+ Problems Solved",
    },
    {
        name: "Geeksforgeeks",
        url: "https://www.geeksforgeeks.org/user/aniketsaha5353/",
        stats: "- 100+ Problems Solved",
    },
    {
        name: "HackerRank",
        url: "https://www.hackerrank.com/aniket_saha",
        stats: "- 5 stars on C++, Python",
    },
];

export const projects = [
    {
        id: 1,
        title: "Wizard-w1",
        repoLink: "https://github.com/Aniket-a14/Wizard-w1",
        image: "/download.jpg",
        languages: ["Python"],
        description: "A Python based AI agent for Data Processing and Analysis.",
        stars: 0,
    },
    {
        id: 2,
        title: "Patreon Clone",
        repoLink: "https://github.com/Aniket-a14/get_me_a_biriyani",
        image: "/patreon.png",
        languages: ["React", "Node.js", "MongoDB"],
        description: "A fully functional Patreon-like platform with subscriptions.",
        stars: 0,
    },
    {
        id: 3,
        title: "Virtual Quiz Game",
        repoLink: "https://github.com/Aniket-a14/Virtual_Quiz_Game",
        image: "/quiz.avif",
        languages: ["Python", "Tkinter", "SQLite"],
        description: "A Python-based quiz game with a leaderboard.",
        stars: 0,
    },
    {
        id: 4,
        title: "Url-Shortener",
        repoLink: "https://github.com/Aniket-a14/url_shortner",
        image: "/url.jpg",
        languages: ["React", "Node.js", "MongoDB"],
        description: "A React-based URL shortening service.",
        stars: 0,
    },
    {
        id: 5,
        title: "Butterfly",
        repoLink: "https://aniket-a14.github.io/Butterfly/",
        image: "/butterfly.png",
        languages: ["JavaScript", "CSS", "HTML"],
        description: "A JavaScript-based butterfly animation.",
        stars: 1,
    },
    {
        id: 6,
        title: "Univeristy Management System",
        repoLink: "https://github.com/Aniket-a14/Uni_Management_System",
        image: "/ums.jpg",
        languages: ["C++", "MySQL"],
        description: "A Management System for a University.",
        stars: 0,
    },
];
