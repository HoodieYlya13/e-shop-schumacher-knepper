import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import 'react-phone-number-input/style.css'
import { CountryCode } from "libphonenumber-js/core";
import { getCountryCallingCode } from 'libphonenumber-js';
import { useTranslations } from "next-intl";
import { getCountries } from "libphonenumber-js";
import Image from "next/image";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { getPhoneInputLabels } from "@/i18n/utils";

interface VisibilityButtonProps {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

function VisibilityButton({
  showPassword,
  setShowPassword,
}: VisibilityButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={() => setShowPassword(true)}
      onMouseUp={() => setShowPassword(false)}
      onTouchStart={() => setShowPassword(true)}
      onTouchEnd={() => setShowPassword(false)}
      onContextMenu={(e) => e.preventDefault()}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent opacity-80 hover:opacity-100 transition hover:scale-110 duration-300 cursor-pointer"
      tabIndex={-1}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        {showPassword ? (
          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
        ) : (
          <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
        )}
      </svg>
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: React.HTMLInputTypeAttribute;
  label?: string;
  labelIsPlaceholder?: boolean;
  placeholder?: string;
  successText?: string;
  errorText?: string;
  required?: boolean;
  requiredTag?: boolean;
  optionalTag?: boolean;
  focusOnMount?: boolean;
  defaultCountry?: CountryCode;
  setValue?: UseFormSetValue<FieldValues>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      label,
      labelIsPlaceholder = true,
      placeholder,
      successText,
      errorText,
      required = true,
      requiredTag = true,
      optionalTag = false,
      focusOnMount = false,
      defaultCountry,
      setValue,
      ...rest
    },
    ref
  ) => {
    const t = useTranslations("COMMON");

    const [showError, setShowError] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
    const [country, setCountry] = useState<CountryCode | undefined>(
      defaultCountry
    );
    const [focused, setFocused] = useState(false);
    const [flagFocused, setFlagFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const internalRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.RefObject<HTMLInputElement | null>).current = node;
      internalRef.current = node;
    };

    useEffect(() => {
      if (!errorText) {
        setShowError(false);
        return;
      }

      const timeout = setTimeout(() => {
        setShowError(true);
      }, 500);

      return () => clearTimeout(timeout);
    }, [errorText]);

    useEffect(() => {
      if (focusOnMount && internalRef.current) {
        internalRef.current.focus();
      }
    }, [focusOnMount]);

    useEffect(() => {
      if (type !== "tel" || !setValue) return;

      if (!rest.name)
        return console.warn(
          "Input name and setValue are required for phone input"
        );

      if (!country || !phoneNumber)
        return setValue(rest.name, "", { shouldValidate: true });

      if (touched)
        setValue(
          rest.name,
          `+${getCountryCallingCode(country)}${phoneNumber}`,
          { shouldValidate: true }
        );
    }, [type, country, phoneNumber, rest.name, setValue, touched]);

    const countries = getCountries().map((code) => ({
      code,
      name: getPhoneInputLabels()[code] || code,
    }));

    const combinedPlaceholder =
      placeholder ||
      (labelIsPlaceholder ? label : "") +
        (optionalTag && !required ? ` (${t("OPTIONAL")})` : "");

    return (
      <>
        {label && (
          <label className="block mb-2 text-sm font-medium text-dark">
            {label}
            {required && requiredTag && <span className="text-invalid">*</span>}
            {optionalTag && !required && <span> ({t("OPTIONAL")})</span>}
          </label>
        )}

        {type === "tel" ? (
          <div
            className={clsx(
              "inline-flex items-center px-2 w-full border rounded outline-none transition-all duration-300",
              focused
                ? "border-accent"
                : errorText
                  ? "border-invalid"
                  : "border-light"
            )}
          >
            <div className="PhoneInputCountry">
              <select
                className="PhoneInputCountrySelect"
                value={country}
                onFocus={() => {
                  setFlagFocused(true);
                  setFocused(true);
                }}
                onBlur={() => {
                  setFlagFocused(false);
                  setFocused(false);
                }}
                onChange={(e) => {
                  setFocused(true);
                  setCountry(e.target.value as CountryCode);
                  internalRef.current?.focus();
                }}
              >
                {countries.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <Image
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
                alt={country || "Country Flag"}
                className={clsx(
                  "PhoneInputCountryIcon w-6 h-4 object-cover border",
                  { "border-accent": flagFocused }
                )}
                width={24}
                height={16}
              />
              <div
                className="PhoneInputCountrySelectArrow"
                style={{
                  borderColor: flagFocused ? "#2b7fff" : "currentColor",
                }}
              />
            </div>
            <span className="mx-2 text-dark">
              {country ? `+${getCountryCallingCode(country)}` : ""}
            </span>

            <input
              type="tel"
              placeholder={combinedPlaceholder}
              required={required}
              className="grow py-2 border-none outline-hidden"
              ref={combinedRef}
              value={phoneNumber || ""}
              autoComplete={rest.autoComplete}
              onBlur={() => {
                setFocused(false);
                setTouched(true);
              }}
              onFocus={() => {
                setFocused(true);
              }}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (touched) setPhoneNumber(e.target.value);
              }}
            />
          </div>
        ) : (
          <div className="relative">
            <input
              {...rest}
              type={
                type !== "password" ? type : showPassword ? "text" : "password"
              }
              placeholder={combinedPlaceholder}
              required={required}
              className={clsx(
                "w-full p-2 border rounded outline-none focus:border-accent transition-all duration-300",
                errorText ? "border-invalid" : "border-light"
              )}
              ref={combinedRef}
              autoComplete={rest.autoComplete}
            />

            {type === "password" && (
              <VisibilityButton
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
          </div>
        )}

        {successText && <p className="text-sm text-valid">{successText}</p>}
        {showError && errorText && (
          <p className="text-sm text-invalid">{errorText}</p>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;