"use client";

import { useParams } from "next/navigation";
import { PublicArticle } from "../../../components/blogs/PublicArticle";

export default function PublicArticlePage() {
  const params = useParams<{ id: string }>();
  return <PublicArticle articleId={params.id} />;
}
