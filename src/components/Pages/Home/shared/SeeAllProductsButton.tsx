'use client';

import { useRouter } from "next/navigation";
import Button from '@/components/UI/shared/elements/Button';

export default function SeeAllProductsButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/products")}
      child="See All Products"
      primary={false}
    />
  );
}