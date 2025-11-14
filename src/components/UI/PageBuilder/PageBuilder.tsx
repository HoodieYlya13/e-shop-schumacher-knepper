import Footer from './Footer';
import NavBar from './NavBar/NavBar';
import CustomerGeoInfo from './CustomerGeoInfo/CustomerGeoInfo';
import clsx from "clsx";
import Aurora from './NavBar/shared/Aurora';

interface PageBuilderProps {
  children: React.ReactNode;
  padding?: boolean;
  fullScreen?: boolean;
  showFooter?: boolean;
  auroraBackground?: boolean;
}

export default function PageBuilder({
  children,
  padding = true,
  fullScreen = true,
  showFooter = true,
  auroraBackground = false,
}: PageBuilderProps) {
  return (
    <div className="flex flex-col bg-primary text-primary font-black">
      <NavBar />

      {auroraBackground && <Aurora speed={0.2} />}

      <div className="flex flex-col min-h-screen z-10">
        <main
          className={clsx(
            "grow text-secondary flex flex-col",
            {
              "p-5 md:p-10 pt-26 md:pt-36": padding,
              "min-h-screen": fullScreen,
            }
          )}
        >
          {children}
        </main>
        {showFooter && <Footer />}
      </div>

      <CustomerGeoInfo />
    </div>
  );
}