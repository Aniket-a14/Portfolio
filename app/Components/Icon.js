import { IconCloud } from "@/components/magicui/icon-cloud";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
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

export function IconCloudDemo() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
}

export default IconCloudDemo;
