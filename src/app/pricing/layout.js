export const metadata = {
  title: "Affordable SMTP & Bulk Email Pricing Plans",
  description: "Compare pricing plans for bulk email campaigns, high-deliverability SMTP relays, dynamic transactional email networks, and our business email extractor tool.",
};

export default function PricingLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Isha Software Solutions Email Services",
    "description": "Enterprise-grade bulk email, SMTP relay, transactional email, and email extractor services.",
    "image": "https://ishasoftwaresolution.com/logo.png",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "2874",
      "highPrice": "50000",
      "offerCount": "7",
      "offers": [
        {
          "@type": "Offer",
          "name": "Transactional Email Plan",
          "price": "2874",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "SMTP Plan-1",
          "price": "7500",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Bulk Email Plan-3",
          "price": "10000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "SMTP Plan-2",
          "price": "12000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Bulk Email Plan-2",
          "price": "15000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Bulk Email Plan-1",
          "price": "20000",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Email Extractor Tool Plan",
          "price": "50000",
          "priceCurrency": "INR"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
