import { getMetadata } from "@/lib/seo";
import BlogsClient from "./BlogsClient";

export const metadata = getMetadata({
  title: "Blog",
  description:
    "Explore technology, art and literature by Aniket Saha.",
  path: "/blogs",
});

export default function BlogsPage() {
  return <BlogsClient />;
}
