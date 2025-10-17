'use client';

import { Collection, Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';
import { getCollection } from '@/utils/products/getCollection';
import ProductTile from './ProductTile';

interface FilterValue {
  canonical: string;
  localized: string;
  handle?: string;
}

interface Filter {
  queryKey: string;
  name: string;
  values: FilterValue[];
}

interface TypeBannerProps {
  handle?: string;
  language: LocaleLanguagesUpperCase;
  title?: string;
}

interface FiltersProps {
  aside?: boolean;
  filters: Filter[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  searchTerm?: string;
}

interface AllProductsProps {
  locale: LocaleLanguages;
  products: Product[];
  searchTerm?: string
};

const Filters = ({
  aside = false,
  filters,
  selectedFilters,
  setSelectedFilters,
  sortOrder,
  setSortOrder,
  searchTerm,
}: FiltersProps) => {
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  if (filters.length === 0) return null;

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
        {filters.filter(f => f.queryKey !== 'type' && f.queryKey !== "supertype").map((filter) => (
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
  
    const typeFilter = (queryKey: 'type' | 'supertype', value: string) => {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };

        if (queryKey === "type") delete newFilters["supertype"];
        if (queryKey === "supertype") delete newFilters["type"];

        if (value === "all") delete newFilters[queryKey];
        else newFilters[queryKey] = [value];

        return newFilters;
      });
    };

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
  ];

  return (
    <>
      <div className="lg:hidden mb-4">
        <div className="flex justify-between">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-2 py-1 bg-ultra-light rounded-md shadow-md font-semibold transform transition-transform duration-300 hover:scale-105"
            aria-expanded={isFilterPanelOpen}
            aria-controls="mobile-filter-panel"
          >
            Filters
          </button>

          <div className="flex items-center">
            <span className="mr-2 font-bold">Sort by:</span>

            <select
              className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold transform transition-transform duration-300 hover:scale-105"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              {sortOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div
            id="mobile-filter-panel"
            className="mt-4 bg-ultra-light p-4 rounded-md shadow-md"
          >
            {filters
              .filter(
                (f) => f.queryKey !== "type" && f.queryKey !== "supertype"
              )
              .map((filter) => (
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
                              selectedFilters[filter.queryKey]?.includes(
                                canonical
                              ) || false
                            }
                            onChange={() =>
                              toggleFilter(filter.queryKey, canonical)
                            }
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

      <div className={clsx("flex justify-between", { "mb-4": !searchTerm })}>
        {!searchTerm && (
          <select
            className="px-1 py-2 bg-ultra-light rounded-md shadow-md font-semibold w-full sm:w-96 transform transition-transform duration-300 hover:scale-105"
            value={
              selectedFilters["type"]?.[0] ||
              selectedFilters["supertype"]?.[0] ||
              "all"
            }
            onChange={(e) => {
              const combinedOptions = filters
                .filter(
                  (f) => f.queryKey === "type" || f.queryKey === "supertype"
                )
                .flatMap((f) =>
                  f.values.map((v) => ({
                    queryKey: f.queryKey,
                    value: v.canonical,
                    label: v.localized,
                  }))
                );
              const selectedOption = combinedOptions.find(
                (opt) => opt.value === e.target.value
              );
              if (selectedOption)
                typeFilter(
                  selectedOption.queryKey as "type" | "supertype",
                  selectedOption.value
                );
              else typeFilter("type", "all");
            }}
          >
            <option value="all">
              {filters.find((f) => f.queryKey === "supertype")?.values?.[0]
                ?.localized || "All wines"}
            </option>

            {(() => {
              const combinedOptions = filters
                .filter(
                  (f) => f.queryKey === "type" || f.queryKey === "supertype"
                )
                .flatMap((f) =>
                  f.values
                    .filter((v) => v.canonical !== "all")
                    .map((v) => ({
                      queryKey: f.queryKey,
                      value: v.canonical,
                      label: v.localized,
                    }))
                );
              return combinedOptions.map((opt) => (
                <option key={`${opt.queryKey}-${opt.value}`} value={opt.value}>
                  {opt.label}
                </option>
              ));
            })()}
          </select>
        )}

        <div className="hidden lg:flex items-center">
          <span className="mr-2 font-bold">Sort by:</span>

          <select
            className="px-4 py-2 bg-ultra-light rounded-md shadow-md font-semibold transform transition-transform duration-300 hover:scale-105"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

const TypeBanner = ({ handle, language, title }: TypeBannerProps) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchCollection = async () => {
      try {
        setLoading(true);
        const data = await getCollection(handle, language);
        setCollection(data);
      } catch (err) {
        console.error("Failed to load collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [handle, language]);

  if (!handle) return null;

  if (loading) return <div className="hidden lg:flex">Loading...</div>; // FIXME add skeleton
  if (!collection) return null;

  return (
    <div className="hidden lg:flex flex-row justify-between lg:mb-4">
      <div>
        <h2 className="text-xl font-bold">{title ?? collection.title}</h2>
        {collection.description && (
          <p className="text-sm text-dark">{collection.description}</p>
        )}
      </div>

      {collection.image && (
        <Image
          src={collection.image.url}
          alt={collection.image.altText || collection.title}
          width={600}
          height={300}
          className="rounded-md h-40 w-auto"
        />
      )}
    </div>
  );
};

const FiltersRecap = ({
  selectedFilters,
  setSelectedFilters,
  filters,
  searchTerm
}: {
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  filters: Filter[];
  searchTerm?: string;
}) => {
  const removeFilter = (filterKey: string, value?: string) => {
    if (filterKey === "search") {
      const newHref = "/products" + window.location.search
        .replace(/([?&])search=[^&]*&?/, '$1')
        .replace(/&$/, '')
        .replace(/\?$/, '');
      return window.location.href = newHref;
    }
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (filterKey === "search") return updated;
      updated[filterKey] = updated[filterKey].filter((v) => v !== value);
      if (updated[filterKey].length === 0) delete updated[filterKey];
      return updated;
    });
  };

  const activeFilters = [
    ...(searchTerm ? [{
      key: "search",
      value: searchTerm,
      label: searchTerm,
      filterName: "Search", // TODO add trad
    }] : []),
    ...Object.entries(selectedFilters).flatMap(([key, values]) => {
      const filterDef = filters.find((f) => f.queryKey === key);
      return values.map((v) => ({
        key,
        value: v,
        label: filterDef?.values.find((fv) => fv.canonical === v)?.localized || v,
        filterName: filterDef?.name || key,
      }));
    }),
  ];

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {activeFilters.map(({ key, value, label, filterName }) => (
        <span
          key={`${key}-${value}`}
          className="px-3 py-1 bg-light rounded-full text-sm font-medium flex items-center gap-2"
        >
          {key === "type" || key === "supertype"
            ? label
            : `${filterName}: ${label}`}
          <button
            onClick={() => removeFilter(key, value)}
            className="text-dark hover:text-invalid font-bold"
            aria-label={`Remove ${filterName} ${label}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};

export default function AllProducts({ locale, products, searchTerm }: AllProductsProps) {
  const t = useTranslations("HOME_PAGE");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key === "search" || key === "sort") return;
      filters[key] = value.split(",");
    });
    return filters;
  });

  const initialSort = searchParams.get("sort") || "name-asc";
  const [sortOrder, setSortOrder] = useState(initialSort);
  
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key === "search" || key === "sort") return;
      filters[key] = value.split(",");
    });
    setSelectedFilters(filters);
  }, [searchParams]);

  const filtersMap: Record<string, { filterName: string; values: FilterValue[] }> = {};
  const productTypes: FilterValue[] = [];
  const productSupertypes: FilterValue[] = [];

  products.forEach((product) => {
    if (
      product.handle.toLowerCase() === "gift-card" ||
      product.title.toLowerCase() === "gift card"
    ) return;

    product.collections?.edges.forEach(({ node }) => {
      if (node.title.toLowerCase() === "gift_card") return;

      const parts = node.title.split("__");
      if (parts.length !== 2) return;
      const canonicalPart = parts[0];
      const localizedPart = parts[1];

      if (canonicalPart.startsWith('type_')) {
        const typeCanonical = canonicalPart.substring(5);
        let localizedTypeName = localizedPart;
        if (
          localizedPart.startsWith("Type_") ||
          localizedPart.startsWith("type_")
        )
          localizedTypeName = localizedPart.substring(5);
        if (!productTypes.some(pt => pt.canonical === typeCanonical))
          productTypes.push({
            canonical: typeCanonical,
            localized: localizedTypeName,
            handle: node.handle,
          });
        return;
      }

      if (canonicalPart.startsWith('supertype_')) {
        const supertypeCanonical = canonicalPart.substring(10);
        let localizedSupertypeName = localizedPart;
        if (
          localizedPart.startsWith("Supertype_") ||
          localizedPart.startsWith("supertype_")
        )
          localizedSupertypeName = localizedPart.substring(10);
        if (!productSupertypes.some(st => st.canonical === supertypeCanonical))
          productSupertypes.push({
            canonical: supertypeCanonical,
            localized: localizedSupertypeName,
            handle: node.handle,
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
  productSupertypes.sort((a, b) => a.localized.localeCompare(b.localized));

  const filters: Filter[] = Object.entries(filtersMap).map(([key, { filterName, values }]) => ({
    queryKey: key,
    name: filterName,
    values,
  }));

  if (productSupertypes.length > 0)
    filters.unshift({
      queryKey: "supertype",
      name: "Supertype",
      values: productSupertypes,
    });

  if (productTypes.length > 0)
    filters.unshift({
      queryKey: "type",
      name: "Type",
      values: productTypes,
    });

  filters.sort((a, b) => {
    if (a.queryKey === 'type') return -1;
    if (b.queryKey === 'type') return 1;
    if (a.queryKey === 'supertype') return -1;
    if (b.queryKey === 'supertype') return 1;
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
    if (sortOrder && sortOrder !== "name-asc") {
      params.set("sort", sortOrder);
    }
    router.push(`?${params.toString()}`);
  }, [selectedFilters, sortOrder, router, searchParams]);

  const filteredProducts = products.filter((product) => {
    if (
      product.handle.toLowerCase() === "gift-card" ||
      product.title.toLowerCase() === "gift card"
    ) return true;

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
      product.handle.toLowerCase() === "gift-card" ||
      product.title.toLowerCase() === "gift card"
  );

  const otherProducts = filteredProducts.filter(
    (product) =>
      product.handle.toLowerCase() !== "gift-card" &&
      product.title.toLowerCase() !== "gift card"
  );

  const sortedOtherProducts = [...otherProducts].sort((a, b) => {
    switch (sortOrder) {
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "price-asc":
        return parseFloat(a.variants.edges[0]?.node.price.amount) - parseFloat(b.variants.edges[0]?.node.price.amount);
      case "price-desc":
        return parseFloat(b.variants.edges[0]?.node.price.amount) - parseFloat(a.variants.edges[0]?.node.price.amount);
      default:
        return 0;
    }
  });

  const finalProducts = [...sortedOtherProducts, ...giftCardProducts];

  const selectedTypeHandle = selectedFilters["type"]?.[0]
  ? productTypes.find((pt) => pt.canonical === selectedFilters["type"]?.[0])?.handle
  : undefined;

  const selectedSupertypeHandle = selectedFilters["supertype"]?.[0]
    ? productSupertypes.find((st) => st.canonical === selectedFilters["supertype"]?.[0])?.handle
    : productSupertypes.find((st) => st.canonical === "all")?.handle;

  const collectionHandleToPass = selectedTypeHandle ?? selectedSupertypeHandle;

  const selectedTypeTitle = selectedFilters["type"]?.[0]
    ? productTypes.find((pt) => pt.canonical === selectedFilters["type"]?.[0])?.localized
    : undefined;

  const selectedSupertypeTitle = selectedFilters["supertype"]?.[0]
    ? productSupertypes.find((st) => st.canonical === selectedFilters["supertype"]?.[0])?.localized
    : productSupertypes.find((st) => st.canonical === "all")?.localized;

  const collectionTitleToPass = selectedTypeTitle ?? selectedSupertypeTitle;

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <Filters
        aside={true}
        filters={filters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
      />

      <section className="flex-grow">
        <TypeBanner
          handle={collectionHandleToPass}
          language={locale.toUpperCase() as LocaleLanguagesUpperCase}
          title={collectionTitleToPass}
        />

        <Filters
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          searchTerm={searchTerm}
        />

        <FiltersRecap
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filters={filters}
          searchTerm={searchTerm}
        />

        {otherProducts.length === 0 && <p>{t("NO_PRODUCTS")}</p>}

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center mx-auto">
          {finalProducts.map((product) => (
            <ProductTile key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}