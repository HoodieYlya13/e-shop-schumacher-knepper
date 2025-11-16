import Phone from '../../NavBar/shared/Phone';
import Mail from '../../NavBar/shared/Mail';
import Fax from '../../NavBar/shared/Fax';
import Location from '../../NavBar/shared/Location';
import { getShopPhone } from '@/lib/services/store-front/shop';

export default async function ContactUs() {
  const phone = await getShopPhone();
  
  return (
    <div className="flex flex-col gap-1">
      <Location />
      <Phone phone={phone} />
      <Mail />
      <Fax />
    </div>
  );
}