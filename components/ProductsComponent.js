import { getProducts } from "../services/ProductsService.js";

export class ProductsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.page = 0;
  }

  async connectedCallback() {
    this.response = await getProducts();
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
          background-color: rgb(from green r 60% b);
        }

        & > button[disabled] {
          background-color: hwb(from var(--color-button) h w b / 50% );
        }
      }

      .button-selected {
        background-color: rgb(from green r 60% b);
      }
       
    </style>
    `;

    this.shadowRoot.append(await this.createTamplate());
    this.footer = this.shadowRoot.querySelector(".paginacion");
    this.footer.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.footer.removeEventListener("click", this);
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
    previous.setAttribute("disabled", "");
    previous.textContent = "Previous";
    const next = document.createElement("button");
    next.textContent = "Next";
    footer.append(previous, next);
    for (let p = 0; p < totalPages; p++) {
      const btn = document.createElement("button");
      if (p === 0) {
        btn.className = "button-selected";
      }
      btn.setAttribute("data-value", p.toString());
      btn.textContent = p + 1;
      next.before(btn);
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
    this.buildContent(tbody);
    table.append(tbody);
    return table;
  }

  async handleEvent(event) {
    const previous =
      this.shadowRoot.querySelector(".paginacion").firstElementChild;
    const next = this.shadowRoot.querySelector(".paginacion").lastElementChild;
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

      if (this.page === 0) {
        previous.setAttribute("disabled", "");
        if (this.page < this.response.totalPages - 1) {
          next.removeAttribute("disabled");
        }
      }

      const table = this.shadowRoot.querySelector("table");
      const { lastElementChild } = table;
      const tbody = lastElementChild.cloneNode(true);
      tbody.innerHTML = "";
      this.response = await getProducts(this.page);
      this.buildContent(tbody);
      const fragment = document.createElement("template");
      fragment.content.append(tbody);
      table.replaceChild(fragment.content.cloneNode(true), lastElementChild);
    }
  }

  buildContent(tbody) {
    this.response.content.forEach((product) => {
      const tr = document.createElement("tr");
      tr.insertAdjacentHTML(
        "afterbegin",
        `<td>${product.id}</td><td>${product.nombre}</td><td>${product.descripcion}</td><td>${product.precio}</td><td>${product.cantidad}</td>`
      );
      tbody.append(tr);
    });
  }
}

customElements.define("products-component", ProductsComponent);
