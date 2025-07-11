"use client";

import { RegisterValues } from "@/schemas/authSchema";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
import { UseFormSetValue } from "react-hook-form";
import { CountryCode } from "libphonenumber-js/core";
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import de from 'react-phone-number-input/locale/de'
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password" | "number" | "tel";
  label?: string;
  labelIsPlaceholder?: boolean;
  placeholder?: string;
  successText?: string;
  errorText?: string;
  required?: boolean;
  requiredTag?: boolean;
  focusOnMount?: boolean;
  setValue?: UseFormSetValue<RegisterValues>;
  defaultCountry?: CountryCode;
  embeddedClass?: boolean;
}

const CustomPhoneInput = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ value, onChange, onBlur, focusOnMount, ...rest }, ref) => {
  return (
    <Input
      type="tel"
      ref={ref}
      placeholder={rest.placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={rest.required}
      focusOnMount={focusOnMount}
      autoComplete="tel"
      embeddedClass={true}
      name={rest.name}
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
      focusOnMount = false,
      embeddedClass = false,
      defaultCountry,
      setValue,
      ...rest
    },
    ref
  ) => {
    const [showError, setShowError] = useState(false);
    const [value, setValueState] = useState<string | undefined>();
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
      if (type === "tel" && setValue) {
        setValue("phone", value || "", { shouldValidate: true });
      }
    }, [value, type, setValue]);

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

    const combinedPlaceholder = placeholder || (labelIsPlaceholder ? label : undefined);
    
    return (
      <>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label}
            {required && requiredTag && <span className="text-red-500">*</span>}
          </label>
        )}
        {type === "tel" && !embeddedClass ? (
          <PhoneInput
            className={clsx("w-full p-2 border rounded", {
              "border-red-500": !!errorText && touched,
            })}
            labels={getPhoneInputLabels()}
            international
            defaultCountry={defaultCountry}
            inputComponent={CustomPhoneInput}
            value={value}
            onChange={setValueState}
            onBlur={(e) => {
              setTouched(true);
              rest.onBlur?.(e as React.FocusEvent<HTMLInputElement>);
            }}
            autoComplete={rest.autoComplete}
            focusOnMount={focusOnMount}
            placeholder={combinedPlaceholder}
            required={required}
          />
        ) : (
          <input
            type={type}
            placeholder={combinedPlaceholder}
            required={required}
            className={clsx(
              embeddedClass
                ? "flex-grow px-2 border-none outline-none"
                : "w-full p-2 border rounded",
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