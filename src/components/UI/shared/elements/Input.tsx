import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import 'react-phone-number-input/style.css'
import { CountryCode } from "libphonenumber-js/core";
import { getCountryCallingCode } from 'libphonenumber-js';
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import de from 'react-phone-number-input/locale/de'
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { useTranslations } from "next-intl";
import { getCountries } from "libphonenumber-js";
import Image from "next/image";
import { FieldValues, UseFormSetValue } from "react-hook-form";

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
    const [country, setCountry] = useState<CountryCode | undefined>(defaultCountry);
    const [focused, setFocused] = useState(false);
    const [flagFocused, setFlagFocused] = useState(false);
    const [touched, setTouched] = useState(false);

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

      if (!rest.name) {
        return console.warn("Input name and setValue are required for phone input");
      }

      if (!country || !phoneNumber) {
        setValue(rest.name, "", { shouldValidate: true });
        return;
      }
      
      if (touched) {
        setValue(
          rest.name,
          `+${getCountryCallingCode(country)}${phoneNumber}`,
          {
            shouldValidate: true,
          }
        );
      }
    }, [type, country, phoneNumber, rest.name, setValue, touched]);

    const getPhoneInputLabels = () => {
      switch (getPreferredLocale()) {
        case "fr":
          return fr;
        case "de":
          return de;
        default:
          return en;
      }
    };

    const countries = getCountries().map(code => ({
      code,
      name: getPhoneInputLabels()[code] || code
    }));
    
    const combinedPlaceholder =
      placeholder || (labelIsPlaceholder ? label : "") + 
      (optionalTag && !required ? ` (${t("OPTIONAL")})` : "");
    
    return (
      <>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label}
            {required && requiredTag && <span className="text-red-500">*</span>}
            {optionalTag && !required && (
              <span className="text-gray-400"> ({t("OPTIONAL")})</span>
            )}
          </label>
        )}

        {type === "tel" ? (
          <div
            className={clsx(
              {
                "inline-flex items-center px-2 w-full border rounded outline-none":
                  type === "tel",
              },
              focused ? "border-blue-500" : "border-gray-300",
              {
                "border-red-500": !!errorText,
              }
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
                  { "border-blue-500": flagFocused }
                )}
                width={24}
                height={16}
              />
              <div
                className="PhoneInputCountrySelectArrow"
                style={{
                  borderColor: flagFocused
                    ? "oklch(62.3% 0.214 259.815)"
                    : "currentColor",
                }}
              />
            </div>
            <span className="mx-2 text-gray-500">
              {country ? `+${getCountryCallingCode(country)}` : ""}
            </span>

            <input
              type="tel"
              placeholder={combinedPlaceholder}
              required={required}
              className="flex-grow py-2 border-none outline-none"
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
          <input
            {...rest}
            type={type}
            placeholder={combinedPlaceholder}
            required={required}
            className={clsx(
              "w-full p-2 border rounded outline-none border-gray-300 focus:border-blue-500",
              {
                "border-red-500": !!errorText,
              }
            )}
            ref={combinedRef}
            autoComplete={rest.autoComplete}
          />
        )}

        {successText && <p className="text-sm text-green-600">{successText}</p>}
        {showError && errorText && (
          <p className="text-sm text-red-600">{errorText}</p>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;