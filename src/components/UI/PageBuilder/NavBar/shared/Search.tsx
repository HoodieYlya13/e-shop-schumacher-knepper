'use client';

import { useEffect, useRef } from 'react';
import Image from "next/image";
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface SearchProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Search({ showSearch, setShowSearch, setShowMenu, setShowCart }: SearchProps) {
  const t = useTranslations('HOME_PAGE');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearch && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        showSearch && "flex w-full h-full items-center justify-between gap-2"
      )}
    >
      {showSearch && (
        <input
          ref={inputRef}
          type="text"
          className="outline-hidden pl-4 rounded-4xl w-full h-full"
          placeholder={t('SEARCH')}
        />
      )}
      <button
        onClick={() => {
          setShowSearch(true);
          setShowMenu(false);
          setShowCart(false);
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