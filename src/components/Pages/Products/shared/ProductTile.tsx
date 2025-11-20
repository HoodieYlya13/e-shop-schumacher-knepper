import { LocaleLanguages } from "@/i18n/utils";
import { addProductToCart } from "@/utils/checkout/manageCart";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import Image from "next/image";
import Link from "next/link";

interface ProductTileProps {
  locale: LocaleLanguages;
  product: Product
};

export default function ProductTile({ locale, product }: ProductTileProps) {
  const mainVariant = product.variants.edges[0]?.node;
  
  return (
    <Link
      href={`/products/${product.handle}`}
      tabIndex={0}
      className="@container cursor-pointer text-start bg-ultra-light flex flex-col aspect-5/6 w-full min-w-40 max-w-80 rounded-2xl overflow-hidden relative custom-shadow group"
    >
      <div className="w-full h-7/10 transition-all duration-500 ease-in-out group-hover:h-0 flex items-center justify-center">
        <div className="relative size-full transform transition-transform duration-700 group-hover:scale-120">
          {product.images.edges.length > 0 && (
            <Image
              src={product.images.edges[0].node.url}
              alt={product.images.edges[0].node.altText ?? product.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
      </div>

      <div className="relative w-full h-3/10 transition-all duration-500 ease-in-out group-hover:h-full">
        <div className="absolute flex flex-col justify-between inset-0 p-4 shadow-[0_-25px_50px_-12px_rgb(0_0_0/0.25)] rounded-b-2xl">
          <div className="flex flex-col gap-1 @3xs:gap-2">
            <p className="truncate group-hover:whitespace-normal group-hover:line-clamp-2 text-sm @5xs:text-lg @4xs:text-xl @3xs:text-2xl font-light">
              {product.title}
            </p>

            <p className="hidden text-xs @4xs:text-sm @3xs:text-base group-hover:line-clamp-4 @2xs:group-hover:line-clamp-5 @xs:group-hover:line-clamp-7">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-1 @3xs:gap-2 text-xs @5xs:text-base @4xs:text-lg @3xs:text-xl">
            <button
              onClick={(e) => {
                e.preventDefault();
                addProductToCart(mainVariant.id, product);
              }}
              disabled={!mainVariant.availableForSale}
              className="hidden group-hover:flex hover:scale-105 transform transition-transform duration-300 items-center justify-center w-full p-1 @3xs:p-2 border rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to cart
            </button>

            <div className="flex items-center gap-1 @3xs:gap-2">
              <p className="font-bold text-base @5xs:text-xl @4xs:text-2xl @3xs:text-3xl">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: mainVariant.price.currencyCode,
                }).format(parseFloat(mainVariant.price.amount))}
              </p>
              {mainVariant.compareAtPrice && (
                <p className="line-through">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: mainVariant.compareAtPrice.currencyCode,
                  }).format(parseFloat(mainVariant.compareAtPrice.amount))}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};