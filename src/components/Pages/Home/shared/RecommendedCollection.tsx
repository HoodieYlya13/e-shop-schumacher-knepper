'use client';

import { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';

interface RecommendedCollectionProps {
  collection: Collection;
}

export default function RecommendedCollection({ collection }: RecommendedCollectionProps) {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-4">
      <Image
        src={collection?.image?.url || "/img/placeholder-collection.png"}
        alt={
          collection?.image?.altText || collection?.title || "Collection Image"
        }
        width={1000}
        height={1000}
        className="w-30 h-30 sm:w-40 sm:h-40 object-cover rounded-full mr-4"
        priority
      />

      <div className="flex flex-col items-center text-center break-words">
        <h1 className="text-xl sm:text-4xl">Nos recommendations</h1>
        <h2 className="sm:text-2xl font-light">{collection?.description || "Retrouvez nos meilleures recommendations"}</h2>
      </div>
    </div>
  );
}