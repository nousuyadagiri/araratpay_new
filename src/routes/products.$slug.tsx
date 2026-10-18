import { createFileRoute, redirect } from "@tanstack/react-router";
import { products, type ProductSlug } from "@/components/ararat/products/productData";

export const Route = createFileRoute("/products/$slug")({
  beforeLoad: ({ params }) => {
    if (Object.hasOwn(products, params.slug)) {
      throw redirect({ to: "/platform/$slug", params: { slug: params.slug as ProductSlug }, statusCode: 301 });
    }
    throw redirect({ to: "/", statusCode: 301 });
  },
  component: () => null,
});