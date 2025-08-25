import { ProductsComponent } from "./components/products/ProductsComponent.js";

(() => {
  const app = document.querySelector("#app");
  app.append(new ProductsComponent());
})();
