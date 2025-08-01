export async function setCustomerIp(customerIp: string) {
  await fetch("/api/customer/ip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerIp }),
  });
}