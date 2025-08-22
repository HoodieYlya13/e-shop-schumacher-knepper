import Footer from './Footer';
import NavBar from './NavBar/NavBar';
import CustomerGeoInfo from './CustomerGeoInfo/CustomerGeoInfo';

interface PageBuilderProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PageBuilder({
  children,
  showFooter = true,
}: PageBuilderProps) {
  return (
    <div className="flex w-screen flex-col border-dark bg-primary text-primary font-black">
      <NavBar />

      <div className="flex flex-col min-h-screen">
        <main className="grow text-secondary">{children}</main>
        {showFooter && <Footer />}
      </div>

      <CustomerGeoInfo />
    </div>
  );
}