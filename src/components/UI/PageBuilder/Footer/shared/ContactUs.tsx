'use client';

import Phone from '../../NavBar/shared/Phone';
import Mail from '../../NavBar/shared/Mail';
import Fax from '../../NavBar/shared/Fax';
import Location from '../../NavBar/shared/Location';

export default function ContactUs() {
  return (
    <div className="flex flex-col gap-1">
      <Location />
      <Phone />
      <Mail />
      <Fax />
    </div>
  );
}