import ContactUs from "@/components/UI/PageLayout/Footer/shared/ContactUs";
import Maps from "@/components/UI/PageLayout/Footer/shared/Maps";
import PageLayout from "@/components/UI/PageLayout/PageLayout";

export default async function ContactUsPage() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-4 grow w-full max-w-5xl mx-auto">
        <div className="text-secondary">
          <ContactUs />
        </div>

        <div className="border h-60">Formulaire</div>

        <Maps />
      </div>
    </PageLayout>
  );
}
