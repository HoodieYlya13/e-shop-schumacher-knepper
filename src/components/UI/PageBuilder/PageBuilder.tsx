import Footer from './Footer';
import NavBar from './NavBar/NavBar';
import CustomerGeoInfo from './CustomerGeoInfo/CustomerGeoInfo';
import clsx from "clsx";

interface PageBuilderProps {
  children: React.ReactNode;
  padding?: boolean;
  fullScreen?: boolean;
  showFooter?: boolean;
}

export default function PageBuilder({
  children,
  padding = true,
  fullScreen = true,
  showFooter = true,
}: PageBuilderProps) {
  return (
    <div className="flex flex-col bg-primary text-primary font-black">
      <NavBar />

      <div className="flex flex-col min-h-screen">
        <main
          className={clsx("grow text-secondary", {
            "p-4 md:p-8 pt-26 md:pt-36": padding,
            "min-h-screen": fullScreen,
          })}
        >
          {children}
        </main>
        {showFooter && <Footer />}
      </div>

      <CustomerGeoInfo />
    </div>
  );
}