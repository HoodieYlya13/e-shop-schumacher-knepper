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

  return (
    <div className="flex gap-6 max-w-7xl mx-auto pt-26 md:pt-36">
      <aside className="w-64 border-r border-gray-200 pr-4 hidden lg:flex flex-col ml-4">
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

      <section className="px-6 flex-grow">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-4 py-2 bg-gray-50 rounded-md shadow-md font-semibold"
            aria-expanded={isFilterPanelOpen}
            aria-controls="mobile-filter-panel"
          >
            Filters
          </button>
          {isFilterPanelOpen && (
            <div
              id="mobile-filter-panel"
              className="mt-4 bg-gray-50 p-4 rounded-md shadow-md"
            >
              {filters.map((filter) => (
                <div key={filter.name} className="mb-2">
                  <button
                    type="button"
                    onClick={() => toggleExpandedFilter(filter.name)}
                    className="font-bold mb-2 w-full text-left border-b border-gray-200 pb-2"
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
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.handle}`}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              {product.images.edges.length > 0 && (
                <div className="relative aspect-square w-full overflow-hidden border-b border-gray-200">
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
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-brand-600">
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