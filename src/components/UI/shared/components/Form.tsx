import React from "react";
import SubmitButton from "../elements/SubmitButton";
import RootErrors from "@/components/UI/shared/elements/RootErrors";

interface FormProps {
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonProps: {
    label: string;
    error?: string;
    disabled?: boolean;
  };
  errors?: Partial<{
    type: string | number;

    message: string;
  }> &
    Record<string, Partial<{ type: string | number; message: string }>>;
}

export default function Form({
    children,
    handleSubmit,
    buttonProps,
    errors
}: FormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}

      <SubmitButton
        label={buttonProps.label}
        error={buttonProps.error}
        disabled={buttonProps.disabled}
      />

      {errors && <RootErrors errors={errors} />}
    </form>
  );
}