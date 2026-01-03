import AuthTestingMode from "@/components/Pages/AuthTest/AuthTestingMode";
import PageLayout from "@/components/UI/PageLayout/PageLayout";

export default function AuthTestingModePage() {
  return (
    <PageLayout
      padding={false}
      showNavBar={false}
      showFooter={false}
      auroraBackground={true}
    >
      <AuthTestingMode />
    </PageLayout>
  );
}
