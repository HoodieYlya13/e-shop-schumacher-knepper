import ContactUs from '@/components/UI/PageBuilder/Footer/shared/ContactUs';
import Maps from '@/components/UI/PageBuilder/Footer/shared/Maps';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';

export default async function ContactUsPage() {
  return (
    <PageBuilder>
      <div className="flex flex-col gap-4 grow w-full max-w-5xl mx-auto">
        <div className="text-secondary">
          <ContactUs />
        </div>

        <div className="border h-60">Formulaire</div>

        <Maps />
      </div>
    </PageBuilder>
  );
}