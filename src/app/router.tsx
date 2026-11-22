import { createBrowserRouter } from "react-router-dom";
import { CatalogPage } from "@/features/catalog/CatalogPage";
import { DesignPage } from "@/features/catalog/DesignPage";
import { HomePage } from "@/features/home/HomePage";
import { CartPage } from "@/features/cart/CartPage";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { OrderPage } from "@/features/order/OrderPage";
import { StoryPage } from "@/features/story/StoryPage";
import { StudioPage } from "@/features/studio/StudioPage";
import { NotFoundPage } from "@/ui/NotFoundPage";
import { Shell } from "@/ui/Shell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalogo", element: <CatalogPage /> },
      { path: "catalogo/:id", element: <DesignPage /> },
      { path: "disenar", element: <StudioPage /> },
      { path: "historia", element: <StoryPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "pago", element: <CheckoutPage /> },
      { path: "pedido/:id", element: <OrderPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
