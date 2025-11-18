import Footer from './Footer/Footer';
import NavBar from './NavBar/NavBar';
import CustomerGeoInfo from './CustomerGeoInfo/CustomerGeoInfo';
import clsx from "clsx";
import Aurora from './NavBar/shared/Aurora';

interface PageBuilderProps {
  children: React.ReactNode;
  padding?: boolean;
  showNavBar?: boolean;
  showFooter?: boolean;
  auroraBackground?: boolean;
}

export default function PageBuilder({
  children,
  padding = true,
  showNavBar = true,
  showFooter = true,
  auroraBackground = false,
}: PageBuilderProps) {
  return (
    <div className="flex flex-col bg-primary text-primary font-black">
      {showNavBar && <NavBar />}

      {auroraBackground && <Aurora speed={0.3} />}

      <div className="flex flex-col z-10">
        <main
          className={clsx("grow text-secondary flex flex-col min-h-dvh", {
            "p-5 md:p-10 pt-26 md:pt-36": padding,
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