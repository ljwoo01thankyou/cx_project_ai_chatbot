import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import LoadingSellerPage from "./pages/LoadingSellerPage";
import SellerPage from "./pages/SellerPage";
import LoadingProductsPage from "./pages/LoadingProductsPage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoadingCheckoutPage from './pages/LoadingCheckoutPage';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/questions",
    Component: QuestionsPage,
  },
  {
    path: "/loading-seller",
    Component: LoadingSellerPage,
  },
  {
    path: "/seller",
    Component: SellerPage,
  },
  {
    path: "/loading-products",
    Component: LoadingProductsPage,
  },
  {
    path: "/products",
    Component: ProductsPage,
  },
  {
    path: "/loading-checkout",
    Component: LoadingCheckoutPage,
  },
  {
    path: "/checkout",
    Component: CheckoutPage,
  },
]);