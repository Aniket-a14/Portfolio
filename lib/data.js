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
        "I build dynamic web apps with React and Next.js while exploring machine learning and data analysis. My projects span full-stack platforms to AI-driven solutions, aiming for efficiency and impact.",
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

export const aboutText =
    "Driven by a passion for coding and innovation, I am a tech enthusiast with a strong interest in Machine Learning and software development. I enjoy solving complex problems, exploring new technologies, and building impactful solutions. My experience spans web development to AI-driven applications, where I continuously expand my skills, optimize code, and experiment with emerging technologies.";


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
    roles: ["Full Stack Developer", "ML Enthusiast", "AI Engineer"],
    avatar: "/logo.jpeg",
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
            role: "Intern",
            company: "Cognizant",
            period: "June’ 26 — Aug' 26",
            type: "On-Site, Bangalore",
            description: "",
            bullets: [
                "Working on real-time project to deploy scalable cloud based solutions.",
                "Gaining hands-on experience in cloud-based development and deployment strategies."
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
