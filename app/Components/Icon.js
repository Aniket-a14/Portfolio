import { IconCloud } from "@/components/magicui/icon-cloud";
import { skillsSlugs } from "../lib/data";

export function IconCloudDemo() {
  const images = skillsSlugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
}

export default IconCloudDemo;
