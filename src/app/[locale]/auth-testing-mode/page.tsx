import AuthTestingMode from "@/components/Pages/AuthTest/AuthTestingMode";
import PageBuilder from "@/components/UI/PageBuilder/PageBuilder";

export default function AuthTestingModePage() {
  return (
    <PageBuilder padding={false} showNavBar={false} showFooter={false} auroraBackground={true}>
      <AuthTestingMode />
    </PageBuilder>
  );
}