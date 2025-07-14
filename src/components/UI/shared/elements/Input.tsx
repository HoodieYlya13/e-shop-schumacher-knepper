"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
import { CountryCode } from "libphonenumber-js/core";
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import de from 'react-phone-number-input/locale/de'
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { useTranslations } from "next-intl";


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
  embeddedClass?: boolean;
  setRawValue?: React.Dispatch<React.SetStateAction<string | number | readonly string[]>>;
  setFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  requiredWarningLog?: boolean;
}

const CustomPhoneInput = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ value, onChange, onBlur, focusOnMount, setRawValue, setFocused, ...rest }, ref) => {
  useEffect(() => {
    if (setRawValue && value !== undefined) {
      setRawValue(value);
    }
  }, [value, setRawValue]);
  
  return (
    <Input
      type="tel"
      ref={ref}
      value={value}
      labelIsPlaceholder={false}
      onChange={onChange}
      onBlur={(e) => {
        onBlur?.(e);
        setFocused?.(false);
      }}
      required={rest.required}
      focusOnMount={focusOnMount}
      autoComplete="tel"
      embeddedClass={true}
      name={rest.name}
      onFocus={() => setFocused?.(true)}
    />
  );
});

CustomPhoneInput.displayName = "CustomPhoneInput";

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
      embeddedClass = false,
      defaultCountry,
      requiredWarningLog = true,
      ...rest
    },
    ref
  ) => {
    const t = useTranslations("COMMON");

    const [showError, setShowError] = useState(false);
    const [valueState, setValueState] = useState<string | undefined>();
    const [rawValue, setRawValue] = useState<string | undefined>();
    const [focused, setFocused] = useState(false);

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

    if (type === "tel" && !embeddedClass && required && requiredWarningLog) {
      console.warn(
        "errors must be provided for tel input validation when required and required logic should be handled by zod schema. To dismiss this warning set requiredWarningLog to false in the parent."
      );
    }

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
        {type === "tel" && !embeddedClass ? (
          <div className="relative">
            <PhoneInput
              type={type}
              className={clsx(
                "border w-full px-2 rounded absolute outline-none",
                focused ? "border-blue-500" : "border-gray-300",
                {
                  "border-red-500": !!errorText && showError,
                }
              )}
              labels={getPhoneInputLabels()}
              international
              defaultCountry={defaultCountry}
              inputComponent={CustomPhoneInput}
              value={valueState}
              onChange={setValueState}
              onBlur={(e) =>
                rest.onBlur?.(e as React.FocusEvent<HTMLInputElement>)
              }
              autoComplete={rest.autoComplete}
              focusOnMount={focusOnMount}
              placeholder={combinedPlaceholder}
              required={required}
              name={rest.name}
              setRawValue={setRawValue}
              setFocused={setFocused}
            />
            <input
              placeholder={!valueState ? combinedPlaceholder : ""}
              className={clsx(
                "w-full p-2 border rounded pl-14 outline-none",
                focused ? "border-blue-500" : "border-gray-300",
                {
                  "pl-25": rawValue,
                }
              )}
              value=""
              readOnly
            />
            <input
              type="hidden"
              value={valueState || ""}
              readOnly
              ref={ref}
              {...rest}
            />
          </div>
        ) : (
          <input
            type={type}
            placeholder={combinedPlaceholder}
            required={required}
            className={clsx(
              embeddedClass
                ? "flex-grow p-2 border-none outline-none"
                : "w-full p-2 border rounded outline-none border-gray-300 focus:border-blue-500",
              {
                "border-red-500": !embeddedClass && !!errorText,
              }
            )}
            ref={combinedRef}
            autoComplete={rest.autoComplete}
            {...rest}
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