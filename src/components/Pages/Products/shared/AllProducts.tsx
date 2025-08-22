'use client';

import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LocaleLanguages } from '@/i18n/utils';
import { useState } from 'react';

interface AllProductsProps {
  locale: LocaleLanguages;
  products: Product[]
};

export default function AllProducts({ locale, products }: AllProductsProps) {
  const t = useTranslations("HOME_PAGE");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  const filtersMap: Record<string, Set<string>> = {};

  products.forEach((product) => {
    product.collections?.edges.forEach(({ node }) => {
      if (node.title.toLowerCase() === "gift_card") return;

      const [filterName, filterValue] = node.title.split("_");
      if (filterName && filterValue) {
        if (!filtersMap[filterName]) {
          filtersMap[filterName] = new Set();
        }
        filtersMap[filterName].add(filterValue);
      }
    });
  });

  const filters = Object.entries(filtersMap)
    .filter(([name]) => name !== "gift_card")
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, values]) => ({
      name,
      values: Array.from(values).sort((a, b) => a.localeCompare(b)),
    }));

  const toggleFilter = (filterName: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      return {
        ...prev,
        [filterName]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const toggleExpandedFilter = (filterName: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filteredProducts = products.filter((product) => {
    return Object.entries(selectedFilters).every(([filterName, values]) => {
      if (values.length === 0) return true;
      return product.collections?.edges.some(({ node }) => {
        const [name, value] = node.title.split("_");
        return name === filterName && values.includes(value);
      });
    });
  });

  const giftCardProducts = filteredProducts.filter(
    (product) =>
      product.handle.toLowerCase() === "gift card" ||
      product.title.toLowerCase() === "gift card"
  );
  const otherProducts = filteredProducts.filter(
    (product) =>
      product.handle.toLowerCase() !== "gift card" &&
      product.title.toLowerCase() !== "gift card"
  );
  const sortedFilteredProducts = [...giftCardProducts, ...otherProducts];

  return (
    <div className="flex gap-12 max-w-7xl mx-auto p-6 pt-26 md:pt-36">
      <aside className="w-64 border-r border-light hidden lg:flex flex-col">
        {filters.map((filter) => (
          <div key={filter.name} className="mb-6">
            <button
              type="button"
              onClick={() => toggleExpandedFilter(filter.name)}
              className="font-bold mb-2 w-full text-left"
              aria-expanded={expandedFilters[filter.name] ?? true}
              aria-controls={`filter-values-${filter.name}`}
            >
              {filter.name}
            </button>
            {(expandedFilters[filter.name] ?? true) && (
              <div id={`filter-values-${filter.name}`}>
                {filter.values.map((value) => (
                  <label key={value} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[filter.name]?.includes(value) || false
                      }
                      onChange={() => toggleFilter(filter.name, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      <section className="flex-grow">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold"
            aria-expanded={isFilterPanelOpen}
            aria-controls="mobile-filter-panel"
          >
            Filters
          </button>
          {isFilterPanelOpen && (
            <div
              id="mobile-filter-panel"
              className="mt-4 bg-ultra-light p-4 rounded-md shadow-md"
            >
              {filters.map((filter) => (
                <div key={filter.name} className="mb-2">
                  <button
                    type="button"
                    onClick={() => toggleExpandedFilter(filter.name)}
                    className="font-bold mb-2 w-full text-left border-b border-light pb-2"
                    aria-expanded={expandedFilters[filter.name] ?? true}
                    aria-controls={`mobile-filter-values-${filter.name}`}
                  >
                    {filter.name}
                  </button>
                  {(expandedFilters[filter.name] ?? false) && (
                    <div id={`mobile-filter-values-${filter.name}`}>
                      {filter.values.map((value) => (
                        <label key={value} className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[filter.name]?.includes(value) || false
                            }
                            onChange={() => toggleFilter(filter.name, value)}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 && <p>{t("NO_PRODUCTS")}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sortedFilteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.handle}`}
              className="bg-white rounded-lg shadow-md border border-light overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              {product.images.edges.length > 0 && (
                <div className="relative aspect-square w-full overflow-hidden border-b border-light">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText ?? product.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-extrabold text-secondary mb-2 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-dark text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-light">
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency:
                        product.variants.edges[0]?.node.price.currencyCode,
                    }).format(
                      parseFloat(product.variants.edges[0]?.node.price.amount)
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}