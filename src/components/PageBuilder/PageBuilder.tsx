'use client';

import Footer from './Footer';
import NavBar from './NavBar';

export default function PageBuilder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NavBar />

      <div className="flex-grow overflow-y-auto">
        <main className="p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}