import { getProducts } from "../../services/ProductsService.js";
import { PaginationComponent } from "../pagination/PaginationComponent.js";
import { TableComponent } from "../table/TableComponent.js";

export class ProductsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.page = 0;
    this.columns = ["Id", "Nombre", "Descripción", "Precio", "Cantidad"];
    this.loadData();
  }

  async loadData() {
    const [cssResponse, productsResponse] = await Promise.all([
      fetch("components/products/css/product.css").then((res) => res.text()),
      getProducts(),
    ]);
    this.response = productsResponse;
    this.cssStyles = cssResponse;
    const styles = document.createElement("style");
    styles.textContent = this.cssStyles;
    this.shadowRoot.append(styles);
    this.tableComponent = new TableComponent(
      this.response.content,
      this.columns
    );
    this.pagination = new PaginationComponent(this.response.totalPages);
    this.shadowRoot.append(this.createTamplate());
    this.footer = this.shadowRoot.querySelector(".paginacion");
    this.footer.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.footer.removeEventListener("click", this);
  }

  createTamplate() {
    const div = document.createElement("div");
    div.setAttribute("part", "products");
    div.className = "container-table";
    div.append(this.tableComponent, this.pagination);
    return div;
  }

  async handleEvent(event) {
    const buttons = Array.from(
      this.shadowRoot.querySelector(".paginacion").children
    );
    const previous = buttons.at(0);
    const next = buttons.at(-1);
    if (event.target.nodeName === "BUTTON") {
      const btn = event.target;

      const footer = this.shadowRoot.querySelector(".paginacion");
      const removeSelected = footer.querySelector(".button-selected");
      removeSelected.classList.remove("button-selected");
      const btnSelected = footer.children[Number.parseInt(btn.textContent)];

      if (btnSelected) {
        btnSelected.className = "button-selected";
      }

      if (btn.textContent === "Next") {
        const { nextElementSibling: selected } = removeSelected;
        selected.className = "button-selected";
        previous.removeAttribute("disabled");
        if (this.page < this.response.totalPages) {
          this.page++;
        }
        if (this.page === this.response.totalPages) {
          next.setAttribute("disabled", "");
        }
      } else if (btn.textContent === "Previous") {
        const { previousElementSibling: selected } = removeSelected;
        selected.className = "button-selected";
        if (this.page == 1) {
          previous.setAttribute("disabled", "");
        }
        if (this.page > 0) {
          this.page--;
          if (this.page < this.response.totalPages - 1) {
            next.removeAttribute("disabled");
          }
        }
      } else {
        this.page = Number.parseInt(btn.getAttribute("data-value"));
      }

      if (this.page > 0) {
        previous.removeAttribute("disabled");
        if (this.page === this.response.totalPages - 1) {
          next.setAttribute("disabled", "");
        }
      }

      if (this.page < this.response.totalPages - 1) {
        next.removeAttribute("disabled");
      }

      if (this.page === 0) {
        previous.setAttribute("disabled", "");
        if (this.page < this.response.totalPages - 1) {
          next.removeAttribute("disabled");
        }
      }
      this.renderTableContent();
    }
  }

  async renderTableContent() {
    const { firstElementChild: table } = this.tableComponent;
    this.response = await getProducts(this.page);
    const fragment = document.createElement("template");
    fragment.content.append(
      this.tableComponent.getTbody(this.response.content)
    );
    table.replaceChild(
      fragment.content.cloneNode(true),
      table.lastElementChild
    );
  }
}

customElements.define("products-component", ProductsComponent);
