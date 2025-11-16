'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { getProductsSearchSuggestions, ProductSuggestion } from '@/utils/products/getProductsSearchSuggestions';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

function SearchIcon() {
  return (
    <svg 
      fill="currentColor"
      height="24" 
      width="24" 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M325.8,0C223,0,139.6,83.4,139.6,186.2c0,33.5,9,64.8,24.4,92L0,442.2l23.3,46.5L69.8,512l164-164 c27.1,15.5,58.5,24.4,92,24.4C428.6,372.4,512,289,512,186.2S428.6,0,325.8,0z M325.8,314.2c-70.7,0-128-57.3-128-128 c0-70.7,57.3-128,128-128s128,57.3,128,128C453.8,256.9,396.5,314.2,325.8,314.2z" />
    </svg>
  );
}

interface SearchProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchSuggestions: React.Dispatch<React.SetStateAction<ProductSuggestion[]>>;
  storedLocale?: LocaleLanguages;
}

export default function Search({
  showSearch,
  setShowSearch,
  setShowMenu,
  setShowCart,
  setSearchSuggestions,
  storedLocale,
}: SearchProps) {
  const t = useTranslations("HOME_PAGE");
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (searchTerm.length > 0 && storedLocale) {
      router.push(`/${storedLocale}/products?search=${searchTerm}`);
      setSearchTerm("");
      setShowSearch(false);
      setSearchSuggestions([]);
    }
  }, [searchTerm, storedLocale, router, setShowSearch, setSearchSuggestions]);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchProducts = async () => {
        const products = await getProductsSearchSuggestions(
          searchTerm,
          storedLocale?.toUpperCase() as LocaleLanguagesUpperCase
        );
        setSearchSuggestions(products);
      };

      const debounceTimeout = setTimeout(fetchProducts, 300);

      return () => clearTimeout(debounceTimeout);
    } else setSearchSuggestions([]);
  }, [searchTerm, storedLocale, setSearchSuggestions]);

  return (
    <div
      className={clsx(
        showSearch && "flex size-full items-center justify-between gap-2"
      )}
    >
      {showSearch && (
        <input
          ref={inputRef}
          type="text"
          className="outline-hidden pl-4 rounded-4xl size-full"
          placeholder={t("SEARCH")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
      )}
      <button
        onClick={() => {
          if (showSearch && searchTerm.length > 0) handleSearch();
          else {
            setShowSearch(true);
            setShowMenu(false);
            setShowCart(false);
          }
        }}
        className={clsx(
          "flex cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300",
          showSearch && "mr-4 text-primary"
        )}
        type="button"
      >
        <SearchIcon />
      </button>
    </div>
  );
}