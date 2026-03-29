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
        stats: "- 650+ Problems Solved",
    },
    {
        name: "Geeksforgeeks",
        url: "https://www.geeksforgeeks.org/user/aniketsaha5353/",
        stats: "- 150+ Problems Solved",
    },
    {
        name: "HackerRank",
        url: "https://www.hackerrank.com/aniket_saha",
        stats: "- 5 stars on C++, Python, Java",
    },
];

export const projects = [
    {
        id: 1,
        title: "SRA",
        repoLink: "https://github.com/Aniket-a14/SRA",
        image: "/sra.png",
        languages: ["React", "Node.js", "PostgreSQL", "TailwindCSS"],
        description: "IEEE based software for requirements specification.",
        stars: 16,
    },
    {
        id: 2,
        title: "Wizard-w1",
        repoLink: "https://github.com/Aniket-a14/Wizard-w1",
        image: "/wizard_w1_branded.png",
        languages: ["Python", "Next.js", "Ollama"],
        description: "A Python based AI agent for Data Processing and Analysis.",
        stars: 2,
    },
    {
        id: 3,
        title: "AI Friend",
        repoLink: "https://github.com/Aniket-a14/AI_friend",
        image: "/ai_friend_branded.png",
        languages: ["React", "Node.js", "MongoDB"],
        description: "An intelligent AI companion designed for meaningful conversations.",
        stars: 1,
    },
    {
        id: 4,
        title: "AI Resume Analyser",
        repoLink: "https://github.com/Aniket-a14/ai-resume-analyser",
        image: "/ai_resume_analyser.png",
        languages: ["Next.js", "Puter.js", "PDF.js"],
        description: "An AI-powered resume analysis tool that extracts information and gives suggestions.",
        stars: 0,
    },
    {
        id: 5,
        title: "Crime Analysis Project",
        repoLink: "https://github.com/Aniket-a14/Crime_Analysis_Project",
        image: "/crime_analysis.png",
        languages: ["Python", "Pandas", "Matplotlib", "Seaborn"],
        description: "A Python-based project for crime analysis that visualizes crime data.",
        stars: 12,
    },
    {
        id: 6,
        title: "SoulSpace",
        repoLink: "https://github.com/Aniket-a14/soulspace",
        image: "/soulspace.png",
        languages: ["React", "Node.js", "MongoDB"],
        description: "A calm, single-page mindfulness web app for sharing thoughts and ideas.",
        stars: 0,  
    },
];

export const profileData = {
    aboutPortfolio: {
        title: "About This Portfolio",
        description: `
This site takes me back to my second year. It’s what first got me into development, inspired by the designs I saw on Awwwards and Dribbble. I wanted to move away from AI templates and reimagine how students tell their own stories. It might not be an award winner, but it’s where everything started for me.
        `,
    },

    aboutMe: {
        title: "About Me",
        description: `
I build systems, not just applications. I’m an AI developer focused on full stack engineering and intelligent workflows. I work end-to-end, from design to AI integration, making sure AI is actually useful in the products I build. I love creating scalable systems where data and interfaces come together to make a real impact.
        `,
    },

    experience: [
        {
            role: "AI Trainer",
            company: "Outlier AI",
            period: "Sep’ 24 — Jan’ 25",
            type: "Remote",
            description: "",
            bullets: [
                "Trained and evaluated AI models across 300+ task types by refining prompts and boosting response accuracy.",
                "Reviewed and debugged over 1000 AI-generated responses to ensure clarity and strict guideline compliance.",
                "Performed 200+ peer evaluations to maintain consistency, improve quality, and reduce error rates across submissions."
            ]
        },
    ],

    skills: {
        languages: ["C/C++", "Python", "JavaScript", "TypeScript"],
        core: ["Data Structures & Algorithm", "OOP", "System Design", "API Development", "Computer Networks"],
        development: ["React", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "Fast API"],
        databases: ["MySQL", "MongoDB", "Postgres SQL"],
        cloudAndDevops: ["Terraform", "Vercel", "GitHub Actions", "CI/CD Pipelines"],
        tools: ["Git", "Postman", "Linux", "Docker"]
    },

    education: [
        {
            degree: "B.Tech in Computer Science and Engineering",
            institution: "Lovely Professional University",
            period: "2023 — Present",
            description: `4-year programme in systems thinking, spatial design, technical drawing, and design process at multiple scales.`,
        },
        {
            degree: "Higher Secondary School",
            institution: "Indira Gandhi Memorial High School",
            period: "2021 — 2023",
            description: `High School Diploma in Science Stream with proficiency in Physics, Chemistry, and Mathematics.`,
        },
    ],

    contact: {
        email: "aniketsahaworkspace@gmail.com",
        linkedin: "https://www.linkedin.com/in/aniketsaha2005",
        github: "https://github.com/Aniket-a14",
        twitter: "https://x.com/AniketSaha41043",
    },
    githubUsername: "Aniket-a14",
};