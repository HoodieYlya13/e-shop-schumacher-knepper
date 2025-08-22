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
              {
                "inline-flex items-center px-2 w-full border rounded outline-none":
                  type === "tel",
              },
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
          <input
            {...rest}
            type={type}
            placeholder={combinedPlaceholder}
            required={required}
            className={clsx(
              "w-full p-2 border rounded outline-none focus:border-accent",
              errorText ? "border-invalid" : "border-light"
            )}
            ref={combinedRef}
            autoComplete={rest.autoComplete}
          />
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