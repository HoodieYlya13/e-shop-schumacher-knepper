'use client';

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { getProductsSearchSuggestions, ProductSuggestion } from '@/utils/products/getProductsSearchSuggestions';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface SearchProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  storedLocale?: LocaleLanguages;
  setSearchSuggestions: React.Dispatch<React.SetStateAction<ProductSuggestion[]>>;
}

export default function Search({ showSearch, setShowSearch, setShowMenu, setShowCart, storedLocale, setSearchSuggestions }: SearchProps) {
  const t = useTranslations('HOME_PAGE');
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (searchTerm.length > 0 && storedLocale) {
      router.push(`/${storedLocale}/products?search=${searchTerm}`);
      setSearchTerm('');
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
        showSearch && "flex w-full h-full items-center justify-between gap-2"
      )}
    >
      {showSearch && (
        <input
          ref={inputRef}
          type="text"
          className="outline-hidden pl-4 rounded-4xl w-full h-full"
          placeholder={t("SEARCH")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
      )}
      <button
        onClick={() => {
          if (showSearch && searchTerm.length > 0) {
            handleSearch();
          } else {
            setShowSearch(true);
            setShowMenu(false);
            setShowCart(false);
          }
        }}
        className={clsx("flex", showSearch && "mr-4 flex")}
        type="button"
      >
        <Image
          src="/img/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
        />
      </button>
    </div>
  );
}