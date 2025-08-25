export class PaginationComponent extends HTMLElement {
  constructor(pagination) {
    super();
    this.pagination = pagination;
    this.append(this.renderFooter());
  }
  renderFooter() {
    const footer = document.createElement("footer");
    footer.className = "paginacion";
    const previous = document.createElement("button");
    previous.setAttribute("disabled", "");
    previous.textContent = "Previous";
    const next = document.createElement("button");
    next.textContent = "Next";
    footer.append(previous, next);
    for (let p = 0; p < this.pagination; p++) {
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
}

customElements.define("pagination-component", PaginationComponent);
