"use client";

import { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import Image from "next/image";

interface RecommendedCollectionProps {
  collection: Collection | null | undefined;
  areRecommendedProducts?: boolean;
}

export default function RecommendedCollection({
  collection,
  areRecommendedProducts,
}: RecommendedCollectionProps) {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-4">
      <Image
        src={
          collection?.image?.url ||
          "/img/placeholder-recommended-collection.png"
        }
        alt={
          collection?.image?.altText ||
          collection?.title ||
          "Recommended Collection Image"
        }
        width={1000}
        height={1000}
        className="size-30 sm:size-40 object-cover rounded-full"
        priority
      />

      <div className="flex flex-col items-center text-center wrap-break-word">
        <h1 className="text-xl sm:text-4xl">
          {areRecommendedProducts ? "Nos recommendations" : "Nos vins"}
        </h1>
        <h2 className="sm:text-2xl font-light">
          {areRecommendedProducts
            ? collection?.description ||
              "Retrouvez nos meilleures recommendations"
            : "Retrouvez tous nos vins"}
        </h2>
      </div>
    </div>
  );
}