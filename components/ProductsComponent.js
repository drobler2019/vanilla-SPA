import { getProducts } from "../services/ProductsService.js";

export class ProductsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = /*html */ `
    <style>
      .container-table {
        overflow: hidden;
        border-radius: 1.2rem;
        inline-size: min-content;
        border: thin solid var(--color-border-table);

      }

      table {
        border-collapse: collapse;
        border-radius: 10px;
        margin: auto;
        min-inline-size: 1200px;
      }

      th {
        background-color: var(--color-head-table);
      }

      td,th {
        padding: 10px;
      }

      tr {
        border: thin solid var(--color-border-table);
        font-size: 1.2rem;
        text-align: center;
        transition: background-color .3s ease-in-out;
      }

      tr:hover {
        background-color: hsl(from white 45deg 70% 0% / 20%);
      }
    </style>
    `;

    this.shadowRoot.append(await this.createTamplate());
  }

  async createTamplate() {
    const template = document.createElement("template");
    const div = document.createElement("div");
    div.setAttribute("part", "products");
    div.className = "container-table";
    div.append(await this.renderTable());
    template.content.append(div);
    return template.content.cloneNode(true);
  }

  async renderTable() {
    const table = document.createElement("table");
    table.insertAdjacentHTML(
      "afterbegin",
      "<thead><tr><th>Id</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Cantidad</th></tr></thead>"
    );
    const tbody = document.createElement("tbody");
    const tfoot = document.createElement("tfoot");
    const products = await getProducts();
    products.forEach((product) => {
      const tr = document.createElement("tr");
      tr.insertAdjacentHTML(
        "afterbegin",
        `<td>${product.id}</td><td>${product.nombre}</td><td>${product.descripcion}</td><td>${product.precio}</td><td>${product.cantidad}</td>`
      );
      tbody.append(tr);
    });
    tfoot.textContent = "hola";
    table.append(tbody, tfoot);
    return table;
  }
}

customElements.define("products-component", ProductsComponent);
