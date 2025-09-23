'use client';

import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LocaleLanguages } from '@/i18n/utils';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface FilterValue {
  canonical: string;
  localized: string;
}

interface Filter {
  queryKey: string;
  name: string;
  values: FilterValue[];
}

interface FiltersProps {
  aside?: boolean;
  filters: Filter[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

interface ProductTileProps {
  locale: LocaleLanguages;
  product: Product
};

interface AllProductsProps {
  locale: LocaleLanguages;
  products: Product[]
};

const Filters = ({
  aside = false,
  filters,
  selectedFilters,
  setSelectedFilters,
}: FiltersProps) => {
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const toggleFilter = (filterName: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      let newValues: string[];

      if (currentValues.includes(value))
        newValues = currentValues.filter((v) => v !== value);
      else newValues = [...currentValues, value];

      const newFilters = {
        ...prev,
        [filterName]: newValues,
      };

      if (newValues.length === 0) delete newFilters[filterName];
      return newFilters;
    });
  };

  const toggleExpandedFilter = (filterName: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  if (aside)
    return (
      <aside className="w-64 border-r border-light hidden lg:flex flex-col pr-2">
        {filters.filter(f => f.queryKey !== 'type').map((filter) => (
          <div key={filter.queryKey} className="mb-6">
            <div className="font-bold mb-2 w-full text-left">{filter.name}</div>

            {filter.values.map(({ canonical, localized }) => (
              <label key={canonical} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={
                    selectedFilters[filter.queryKey]?.includes(canonical) || false
                  }
                  onChange={() => toggleFilter(filter.queryKey, canonical)}
                />
                {localized}
              </label>
            ))}
          </div>
        ))}
      </aside>
    );
  
  const typeFilter = (value: string) => {
    if (value === "all")
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters["type"];
        return newFilters;
      });
    else
      setSelectedFilters((prev) => ({
        ...prev,
        type: [value],
      }));
  }

  return (
    <>
      <div className="lg:hidden mb-4">
        <div className="flex justify-between">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold"
            aria-expanded={isFilterPanelOpen}
            aria-controls="mobile-filter-panel"
          >
            Filters
          </button>

          <div className="flex items-center">
            <span className="mr-2 font-bold">Sort by:</span>

            <select className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div
            id="mobile-filter-panel"
            className="mt-4 bg-ultra-light p-4 rounded-md shadow-md"
          >
            {filters.filter(f => f.queryKey !== 'type').map((filter) => (
              <div key={filter.queryKey} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleExpandedFilter(filter.queryKey)}
                  className="font-bold mb-2 w-full text-left border-b border-light pb-2"
                  aria-expanded={expandedFilters[filter.queryKey] ?? true}
                  aria-controls={`mobile-filter-values-${filter.queryKey}`}
                >
                  {filter.name}
                </button>

                {(expandedFilters[filter.queryKey] ?? false) && (
                  <div id={`mobile-filter-values-${filter.queryKey}`}>
                    {filter.values.map(({ canonical, localized }) => (
                      <label
                        key={canonical}
                        className="flex items-center gap-2 mb-1"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters[filter.queryKey]?.includes(canonical) ||
                            false
                          }
                          onChange={() => toggleFilter(filter.queryKey, canonical)}
                        />
                        {localized}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex mb-4 justify-between">
        <select
          className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold w-full sm:w-96"
          value={selectedFilters['type']?.[0] || 'all'}
          onChange={(e) => {
            typeFilter(e.target.value);
          }}
        >
          <option value="all">All wines</option>
          {filters.find(f => f.queryKey === 'type')?.values.map(v => (
            <option key={v.canonical} value={v.canonical}>{v.localized}</option>
          ))}
        </select>

        <div className="hidden lg:flex items-center">
          <span className="mr-2 font-bold">Sort by:</span>

          <select className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </>
  );
};

const ProductTile = ({ locale, product }: ProductTileProps) => {
  return (
    <Link
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
              currency: product.variants.edges[0]?.node.price.currencyCode,
            }).format(parseFloat(product.variants.edges[0]?.node.price.amount))}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function AllProducts({ locale, products }: AllProductsProps) {
  const t = useTranslations("HOME_PAGE");
  const router = useRouter();
  const searchParams = useSearchParams();

  const parseFiltersFromSearchParams = (): Record<string, string[]> => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key === 'search') return;
      filters[key] = value.split(',');
    });
    return filters;
  };

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => parseFiltersFromSearchParams());

  useEffect(() => {
    setSelectedFilters(parseFiltersFromSearchParams());
  }, [searchParams]);

  const filtersMap: Record<string, { filterName: string; values: FilterValue[] }> = {};
  const productTypes: FilterValue[] = [];

  products.forEach((product) => {
    product.collections?.edges.forEach(({ node }) => {
      if (node.title.toLowerCase() === "gift_card") return;

      const parts = node.title.split("__");
      if (parts.length !== 2) return;
      const canonicalPart = parts[0];
      const localizedPart = parts[1];

      if (canonicalPart.startsWith('type_')) {
        const typeCanonical = canonicalPart.substring(5);
        let localizedTypeName = localizedPart;
        if (localizedPart.startsWith('type_')) localizedTypeName = localizedPart.substring(5);
        if (!productTypes.some(pt => pt.canonical === typeCanonical))
          productTypes.push({
            canonical: typeCanonical,
            localized: localizedTypeName,
          });
        return;
      }

      const [filterKey, filterValueCanonical] = canonicalPart.split("_");
      if (!filterKey || !filterValueCanonical) return;

      const localizedParts = localizedPart.split("_");
      const localizedFilterName = localizedParts[0] ?? filterKey;
      const localizedFilterValue = localizedParts[1] ?? filterValueCanonical;

      if (!filtersMap[filterKey]) 
        filtersMap[filterKey] = {
          filterName: localizedFilterName,
          values: [],
        };

      if (!filtersMap[filterKey].values.some(v => v.canonical === filterValueCanonical))
        filtersMap[filterKey].values.push({
          canonical: filterValueCanonical,
          localized: localizedFilterValue,
        });
    });
  });

  Object.values(filtersMap).forEach(({ values }) => {
    values.sort((a, b) => a.localized.localeCompare(b.localized));
  });

  productTypes.sort((a, b) => a.localized.localeCompare(b.localized));

  const filters = Object.entries(filtersMap).map(([key, { filterName, values }]) => ({
    queryKey: key,
    name: filterName,
    values: values.map((v) => ({
      canonical: v.canonical,
      localized: v.localized,
    })),
  }));

  if (productTypes.length > 0)
    filters.unshift({
      queryKey: "type",
      name: "Type",
      values: productTypes,
    });

  filters.sort((a, b) => {
    if (a.queryKey === 'type') return -1;
    if (b.queryKey === 'type') return 1;
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    const params = new URLSearchParams();
    const searchValue = searchParams.get('search');
    if (searchValue) {
      params.set('search', searchValue);
    }
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(','));
    });
    router.push(`?${params.toString()}`);
  }, [selectedFilters, router, searchParams]);

  const filteredProducts = products.filter((product) => {
    return Object.entries(selectedFilters).every(([filterName, values]) => {
      if (!values || values.length === 0) return true;
      return (
        product.collections?.edges.some(({ node }) => {
          const parts = node.title.split("__");
          if (parts.length !== 2) return false;
          const canonicalPart = parts[0];
          const [name, value] = canonicalPart.split("_");
          return name === filterName && values.includes(value);
        }) ?? false
      );
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
      <Filters
        aside={true}
        filters={filters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <section className="flex-grow">
        <Filters
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        {products.length === 0 && <p>{t("NO_PRODUCTS")}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sortedFilteredProducts.map((product) => (
            <ProductTile key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}