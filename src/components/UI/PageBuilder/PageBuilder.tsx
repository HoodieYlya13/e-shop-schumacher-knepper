import Footer from './Footer';
import NavBar from './NavBar/NavBar';
import CustomerGeoInfo from './CustomerGeoInfo/CustomerGeoInfo';
import clsx from "clsx";

interface PageBuilderProps {
  children: React.ReactNode;
  padding?: boolean;
  showFooter?: boolean;
}

export default function PageBuilder({
  children,
  padding = true,
  showFooter = true,
}: PageBuilderProps) {
  return (
    <div className="flex w-screen flex-col border-dark bg-primary text-primary font-black">
      <NavBar />

      <div className="flex flex-col min-h-screen">
        <main className={clsx("grow text-secondary", padding && "p-4 md:p-8 pt-26 md:pt-36")}>{children}</main>
        {showFooter && <Footer />}
      </div>

      <CustomerGeoInfo />
    </div>
  );
}