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
        border-radius: 5px;
        inline-size: min-content;
        --border-style: thin solid var(--color-border-table);
        --color-button: #155DFC;
        border: var(--border-style);

      }

      table {
        border-collapse: collapse;
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
        border: var(--border-style);
        font-size: 1rem;
        text-align: center;
        transition: background-color .3s ease-in-out;
      }

      tr:hover {
        background-color: hsl(from white 45deg 70% 0% / 20%);
      }

      footer {
        padding: 10px;
        display: flex;
        column-gap: 5px;
        justify-content: end;
        border: inherit;
        & > button {
          border: none; 
          background-color: var(--color-button);
          padding: 7px 10px;
          border-radius: 3px;
          color: #EDE9FE;
          cursor: pointer;
        }

        & > button:hover {
          background-color: hwb(from var(--color-button) h w 20%);
        }
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
    div.append(this.renderFooter());
    template.content.append(div);
    return template.content.cloneNode(true);
  }

  renderFooter() {
    const { totalPages } = this.response;
    const footer = document.createElement("footer");
    footer.className = "paginacion";
    const previous = document.createElement("button");
    previous.textContent = "Previous";
    const next = document.createElement("button");
    next.textContent = "Next";
    footer.append(previous, next);
    const { lastElementChild: last } = footer;
    for (let p = 0; p < totalPages; p++) {
      const btn = document.createElement("button");
      btn.textContent = p + 1;
      last.before(btn);
    }
    return footer;
  }

  async renderTable() {
    const table = document.createElement("table");
    table.insertAdjacentHTML(
      "afterbegin",
      "<thead><tr><th>Id</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Cantidad</th></tr></thead>"
    );
    const tbody = document.createElement("tbody");
    this.response = await getProducts();
    this.response.content.forEach((product) => {
      const tr = document.createElement("tr");
      tr.insertAdjacentHTML(
        "afterbegin",
        `<td>${product.id}</td><td>${product.nombre}</td><td>${product.descripcion}</td><td>${product.precio}</td><td>${product.cantidad}</td>`
      );
      tbody.append(tr);
    });
    table.append(tbody);
    return table;
  }
}

customElements.define("products-component", ProductsComponent);
