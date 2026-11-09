import {
    FaLinkedin,
    FaGithub,
    FaInstagram,
    FaFacebook,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const heroData = {
    title: "Hello",
    subTitle: "I'm",
    roles: ["a Web Developer", "Aniket Saha", "a Software Dev"],
    description:
        "I build AI systems that check their own work: multi-agent pipelines, local-first data agents and a cognitive voice system, plus the full-stack products around them in React and Next.js.",
    links: {
        react: "https://react.dev/",
        nextjs: "https://nextjs.org/",
        linkedin: "https://www.linkedin.com/in/aniketsaha2005/",
        github: "https://github.com/Aniket-a14/",
        resume: "/aniket_cv.pdf",
    },
    socialDescription: "Many know me from LinkedIn and GitHub, where I share projects and learnings.",
    ctaText: "Let’s build something amazing together!",
};

export const aboutText = `My story starts in my second year, when I came across the designs on Awwwards and Dribbble and wanted to build something that felt alive. That curiosity pulled me into web development, and into computer science and engineering at Lovely Professional University, where I fell for solving complex problems. I have solved over 1,100 of them so far.

From there my interest moved toward AI. I trained and evaluated AI models, and I began building intelligent workflows of my own: SRA, a multi-agent system that turns ideas into specifications, Wizard-w2, a local-first data agent, and AI Friend, a voice companion with emotion and memory. Each one taught me the same lesson, that AI is only useful when you can trust it.

That curiosity became a research paper in IEEE Xplore on humanoid robots, and it shows up in my writing on Medium too, in essays like “The Day Robots Stop Feeling Like Machines” and stories like “Responsibility from the eyes of a woman”.`;


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
        name: "X (Formerly Twitter)",
        url: "https://x.com/AniketSaha41043",
        icon: FaXTwitter,
        colorClass: "group-hover:text-gray-400",
    },
];

export const codingProfiles = [
    {
        name: "LeetCode",
        slug: "leetcode",
        url: "https://leetcode.com/u/Wizard_a14/",
        stats: "700+ Problems Solved",
        index: "01"
    },
    {
        name: "GeeksforGeeks",
        slug: "geeksforgeeks",
        url: "https://www.geeksforgeeks.org/user/aniketsaha5353/",
        stats: "150+ Problems Solved",
        index: "02"
    },
    {
        name: "HackerRank",
        slug: "hackerrank",
        url: "https://www.hackerrank.com/aniket_saha",
        stats: "5 Star Proficiency",
        index: "03"
    },
];

// Project metadata now lives in the frontmatter of `content/projects/*.mdx`
// and is read through `lib/projects.js`. See getAllProjects().

export const reviews = [
  {
    name: "Snehasis",
    username: "@snehasis.18",
    body: "Very nice website. I like it. Very animating website. Looking like a wow",
    img: "/snehasis.jpg",
    alt: "Snehasis",
  },
  {
    name: "Ankit Kumar",
    username: "@Ankit_03",
    body: "Nice Website, Really appreciable.",
    img: "/ankit.jpg",
    alt: "Ankit Kumar",
  },
  {
    name: "Koushik",
    username: "@koushik.04",
    body: "Its Simple, Elegant and Classic. Just Fantastic...",
    img: "/koushik.jpg",
    alt: "Koushik",
  },
  {
    name: "Himanshu",
    username: "@himanshu720",
    body: "This is seriously impressive, and I’m loving it.",
    img: "/himanshu.jpg",
    alt: "Himanshu",
  },
  {
    name: "Arghya Dutta",
    username: "@Arghya.007",
    body: "Could be better, but still good.",
    img: "/arghya.jpg",
    alt: "Arghya Dutta",
  },
  {
    name: "Sachin",
    username: "@sachin.69",
    body: " I can’t even describe how I feel. Just wow.",
    img: "/sachin.jpg",
    alt: "Sachin",
  },
  {
    name: "Abhipsa",
    username: "@.abhipsaghosh.",
    body: "I love this website. It's so beautiful and I'm so happy to see it.",
    img: "/abhipsa.jpg",
    alt: "Abhipsa",
  }
];

export const profileData = {
    name: "Aniket Saha",
    roles: ["AI Engineer", "Full Stack Developer", "ML Enthusiast"],
    avatar: "/logo.jpeg",
    aboutPortfolio: {
        title: "About This Portfolio",
        description: `
This site began in my second year, inspired by the designs I saw on Awwwards and Dribbble. This version is set like a printed magazine, because I wanted to tell the work the way I would write about it: the decisions, the trade-offs and what I would do differently. It might not be an award winner, but it’s where everything started for me.
        `,
    },

    aboutMe: {
        title: "About Me",
        description: `
I build systems, not just applications. I work end-to-end, from design to AI integration, and this summer I interned at Cognizant on LLMs, prompt engineering and workflow automation. I love creating scalable systems where data and interfaces come together to make a real impact.
        `,
    },

    experience: [
        {
            role: "Summer Intern",
            company: "Cognizant Technology Solutions",
            period: "Jun’ 26 — Aug’ 26",
            type: "On-Site, Bangalore",
            description: "",
            bullets: [
                "Contributed to the development of AI- and automation-driven solutions for enterprise workflows within a client delivery team.",
                "Worked on multiple AI use cases involving Large Language Models, prompt engineering, and workflow automation.",
                "Collaborated with cross-functional team members to analyze requirements and develop AI-powered proof-of-concepts for enterprise applications."
            ]
        },
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

    achievements: [
        {
            period: "Oct’ 26",
            title: "Research paper, IEEE Xplore",
            sub: "ICoICI 2026 conference proceedings",
            url: "https://ieeexplore.ieee.org/document/11723498",
            bullets: [
                "“A Novel Framework for Improved Cognitive, Emotional, and Vocal Interaction in Conversational Humanoid Robots Assisted by Hybrid Neuromodulatory Network Architecture”."
            ]
        },
        {
            period: "Nov’ 25 — Present",
            title: "Open-source contributor",
            sub: "",
            links: [
                { label: "GitHub", url: "https://github.com/Aniket-a14/" },
            ],
            bullets: [
                "Publishing reusable components and contributing to open-source projects, collaborating with practical experience in codebases."
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
            description: `4-year programme in computer science with engineering minor in Data Science.`,
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
        x: "https://x.com/AniketSaha41043",
    },
    githubUsername: "Aniket-a14",
    mediumUsername: "aniketsahaworkspace",
};
