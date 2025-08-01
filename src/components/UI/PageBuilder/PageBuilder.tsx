import Footer from './Footer';
import NavBar from './NavBar/NavBar';
import BuyerGeoInfo from './BuyerGeoInfo/BuyerGeoInfo';

interface PageBuilderProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PageBuilder({
  children,
  showFooter = true,
}: PageBuilderProps) {  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NavBar />

      <div className="flex-grow overflow-y-auto">
        <main className="p-6">{children}</main>
        {showFooter && <Footer />}
      </div>

      <BuyerGeoInfo />
    </div>
  );
}