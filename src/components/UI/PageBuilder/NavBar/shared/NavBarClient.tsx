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

interface NavBarClientProps {
  customerAccessToken?: string;
  storedLocale?: LocaleLanguages;
}

export default function NavBarClient({ customerAccessToken, storedLocale }: NavBarClientProps) {
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

  if (showSearch)
    return (
      <div
        ref={navBarRef}
        className={`relative bg-secondary/50 backdrop-blur-md flex flex-col mx-auto items-start border border-accent rounded-4xl shadow-lg shadow-accent/30 w-full md:max-w-4xl transition-all duration-300 ease-in-out overflow-hidden`}
        style={{
          height: `${suggestionsHeight}rem`,
        }}
      >
        <div className="absolute h-16 items-center flex w-full border-b border-accent rounded-4xl">
          <Search
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowMenu={setShowMenu}
            setShowCart={setShowCart}
            storedLocale={storedLocale}
            setSearchSuggestions={setSearchSuggestions}
          />
        </div>

        {!!searchSuggestions && ( // TODO: navigate with arrow keys
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
                  <p className="flex-grow truncate overflow-hidden whitespace-nowrap">
                    {suggestion.title}
                  </p>{" "}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div
      className={clsx(
        "relative backdrop-blur-md flex mx-auto border border-accent rounded-4xl shadow-lg shadow-accent/30 h-16 w-full md:max-w-7xl transition-all duration-300 ease-in-out",
        showCart &&
          "h-[calc(100vh-2.5rem)] md:h-[calc(100vh-5rem)] items-start",
        showMenu && "h-[calc(100vh-2.5rem)] sm:h-72 md:h-16 md:items-start",
        showCart || showMenu || showSearch ? "bg-secondary/50" : "bg-primary/30"
      )}
      ref={navBarRef}
    >
      <div className="absolute h-16 items-center flex justify-between mx-auto w-full">
        <div className="ml-4 flex items-center align-middle gap-4">
          <button
            onClick={() => {
              setShowMenu(!showMenu);
              setShowCart(false);
            }}
            className="z-30 md:hidden"
          >
            <Image
              src="/img/icons/burger.svg"
              width={24}
              height={24}
              alt="menu"
              className="cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
            />
          </button>

          <Logo />

          <div className="hidden md:flex">
            <Navigation
              customerAccessToken={customerAccessToken}
              setShowMenu={setShowMenu}
            />
          </div>
        </div>

        <div className="flex items-center align-middle gap-4 mr-4">
          <Search
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowMenu={setShowMenu}
            setShowCart={setShowCart}
            storedLocale={storedLocale}
            setSearchSuggestions={setSearchSuggestions}
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
        <div className="absolute top-20 left-4">
          <CartContent />
        </div>
      )}
    </div>
  );
}