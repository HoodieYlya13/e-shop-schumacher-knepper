"use client";

import { useTranslations } from "next-intl";
import SignInTestingMode from "./shared/SignInTestingMode";
import { useAuthTestingModeForm } from "@/hooks/authTestingMode/useAuthTestingModeForm";
import Form from "@/components/UI/shared/components/Form";
import { authTestingModeSubmitHandler } from "@/utils/authTestingMode/authSubmitHandler";

export default function AuthTestingMode() {
  const t = useTranslations('AUTH');
  const form = useAuthTestingModeForm();

  return (
    <section className="flex flex-1 w-full justify-center items-center p-5 md:p-10">
      <div className="max-w-md w-full h-fit mx-auto p-6 space-y-6 rounded-4xl shadow-lg shadow-accent/30 backdrop-blur-md bg-light/50 outline outline-accent/50">
        <Form
          handleSubmit={form.handleSubmit(async (data) => {
            await authTestingModeSubmitHandler(
              data,
              form.clearErrors,
              form.setError
            );
          })}
          buttonProps={{
            label: t(form.formState.isSubmitting ? "LOADING" : "LOGIN"),
            error:
              form.formState.isSubmitted &&
              Object.keys(form.formState.errors).some((k) => k !== "root")
                ? t("ERRORS.CORRECT_FIELDS_BEFORE_SUBMIT")
                : undefined,
            disabled:
              form.formState.isSubmitting ||
              Object.values(form.watch()).every((value) => !value) ||
              (form.formState.isSubmitted &&
                Object.keys(form.formState.errors).filter((k) => k !== "root")
                  .length > 0),
          }}
          errors={form.formState.errors.root}
        >
          <SignInTestingMode
            register={form.register}
            errors={form.formState.isSubmitted ? form.formState.errors : {}}
          />
        </Form>
      </div>
    </section>
  );
}