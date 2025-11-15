"use client";

import { useEffect, useRef, useState } from "react";
import Search from "./Search";
import Navigation from "./Navigation";
import Phone from "./Phone";
import LanguageSwitcher from "./LanguageSwitcher";
import ShoppingCart from "./ShoppingCart";
import { LocaleLanguages } from "@/i18n/utils";
import Image from "next/image";
import Logo from "./Logo";
import clsx from "clsx";
import { ProductSuggestion } from "@/utils/products/getProductsSearchSuggestions";
import Link from "next/link";
import CartContent from "./CartContent";

function BurgerIcon() {
  return (
    <svg 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="24"
      height="24"
    >
      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
    </svg>
  );
}

interface SearchSuggestionsProps {
  searchSuggestions: ProductSuggestion[];
  storedLocale: LocaleLanguages;
}

function SearchSuggestions({ searchSuggestions, storedLocale }: SearchSuggestionsProps) {
  return (
    <div className="w-full h-fit p-4 pt-20 gap-2 flex flex-col">
      {searchSuggestions.map((suggestion) => (
        <Link
          key={suggestion.handle}
          href={`/${storedLocale}/products/${suggestion.handle}`}
        >
          <div className="h-8 border-b border-accent flex items-center gap-2">
            {suggestion.image && (
              <Image
                src={suggestion.image.url}
                alt={suggestion.image.altText || suggestion.title}
                width={24}
                height={24}
                className="object-cover rounded"
              />
            )}
            <p className="grow truncate overflow-hidden whitespace-nowrap">
              {suggestion.title}
            </p>{" "}
          </div>
        </Link>
      ))}
    </div>
  );
}

interface NavBarContentProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  searchSuggestions: ProductSuggestion[];
  setSearchSuggestions: React.Dispatch<React.SetStateAction<ProductSuggestion[]>>;
  storedLocale: LocaleLanguages;
  customerAccessToken?: string;
}

function NavBarContent({
  showSearch,
  setShowSearch,
  showMenu,
  setShowMenu,
  showCart,
  setShowCart,
  searchSuggestions,
  setSearchSuggestions,
  storedLocale,
  customerAccessToken,
}: NavBarContentProps) {
  if (showSearch)
    return (
      <>
        <div className="absolute h-16 items-center flex w-full border-b border-accent rounded-4xl">
          <Search
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowMenu={setShowMenu}
            setShowCart={setShowCart}
            setSearchSuggestions={setSearchSuggestions}
            storedLocale={storedLocale}
          />
        </div>

        {/* TODO: navigate with arrow keys and escape */}
        {!!searchSuggestions && (
          <SearchSuggestions
            searchSuggestions={searchSuggestions}
            storedLocale={storedLocale}
          />
        )}
      </>
    );

  return (
    <>
      <div className="absolute h-16 items-center flex justify-between mx-auto w-full">
        <div
          className={clsx(
            "ml-4 flex items-center align-middle gap-4",
            showMenu || showCart ? "text-primary" : "text-secondary"
          )}
        >
          <button
            onClick={() => {
              setShowMenu(!showMenu);
              setShowCart(false);
            }}
            className="z-30 md:hidden cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
          >
            <BurgerIcon />
          </button>

          <Logo />

          <div className="hidden md:flex">
            <Navigation
              customerAccessToken={customerAccessToken}
              setShowMenu={setShowMenu}
            />
          </div>
        </div>

        <div
          className={clsx(
            "flex items-center align-middle gap-4 mr-4",
            showMenu || showCart ? "text-primary" : "text-secondary"
          )}
        >
          <Search
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowMenu={setShowMenu}
            setShowCart={setShowCart}
            setSearchSuggestions={setSearchSuggestions}
            storedLocale={storedLocale}
          />

          <div className="hidden md:flex gap-4">
            <Phone />
            <LanguageSwitcher storedLocale={storedLocale} />
          </div>

          <ShoppingCart
            showCart={showCart}
            setShowCart={setShowCart}
            setShowMenu={setShowMenu}
          />
        </div>
      </div>

      {showMenu && (
        <>
          <div className="absolute top-20 left-4 text-2xl flex md:hidden">
            <Navigation
              customerAccessToken={customerAccessToken}
              setShowMenu={setShowMenu}
            />
          </div>

          <div className="absolute bottom-4 items-center flex justify-between mx-auto px-4 w-full md:hidden">
            <Phone />
            <LanguageSwitcher storedLocale={storedLocale} />
          </div>
        </>
      )}

      {showCart && (
        <div className="w-full h-full p-4 pt-16">
          <CartContent />
        </div>
      )}
    </>
  );
}

interface NavBarClientProps {
  customerAccessToken?: string;
  storedLocale?: LocaleLanguages;
}

export default function NavBarClient({ customerAccessToken, storedLocale = "en" }: NavBarClientProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<ProductSuggestion[]>([]);

  const navBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (showMenu || showCart || showSearch) &&
        navBarRef.current &&
        !navBarRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        setShowCart(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, showCart, showSearch]);

  const suggestionsHeight = searchSuggestions.length
    ? 6 + searchSuggestions.length * 2 + (searchSuggestions.length - 1) * 0.5
    : 4;

  const dynamicHeight = showSearch ? `${suggestionsHeight}rem` : undefined;
  
  const navBarClasses = clsx(
    "relative backdrop-blur-md flex mx-auto outline outline-accent/50 rounded-4xl shadow-lg shadow-accent/30 transition-all duration-300 ease-in-out",
    {
      "flex-col items-start w-full md:max-w-4xl": showSearch,
      "h-16 w-full md:max-w-7xl": !showSearch,
      "h-[calc(100dvh-2.5rem)] md:h-[calc(100dvh-5rem)] items-start": showCart,
      "h-[calc(100dvh-2.5rem)] md:h-16 md:items-start": showMenu,
      "bg-secondary/50": showCart || showMenu || showSearch,
      "bg-light/50": !(showCart || showMenu || showSearch),
    }
  );

  return (
    <div
      ref={navBarRef}
      className={navBarClasses}
      style={{
        height: dynamicHeight,
      }}
    >
      <NavBarContent
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showCart={showCart}
        setShowCart={setShowCart}
        searchSuggestions={searchSuggestions}
        setSearchSuggestions={setSearchSuggestions}
        storedLocale={storedLocale}
        customerAccessToken={customerAccessToken}
      />
    </div>
  );
}