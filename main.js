import { ProductsComponent } from "./components/ProductsComponent.js";

(() => {
  const app = document.querySelector("#app");
  app.append(new ProductsComponent());
})();
