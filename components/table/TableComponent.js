export class TableComponent extends HTMLElement {
  constructor(data, params) {
    super();
    const template = document.createElement("template");
    const table = document.createElement("table");
    table.append(this.getThead(params), this.getTbody(data));
    template.content.append(table);
    this.append(template.content.cloneNode(true));
  }
  getThead(columns) {
    const thead = document.createElement("thead");
    const content = columns.map((value) => `<th>${value}</th>`).join("");
    thead.insertAdjacentHTML("afterbegin", `<tr>${content}</tr>`);
    return thead;
  }
  getTbody(data) {
    const values = data.map((obj) => Object.values(obj));
    const tbody = document.createElement("tbody");
    const content = values.map((value) => {
      const tr = document.createElement("tr");
      const elements = value.map((v) => {
        const td = document.createElement("td");
        td.textContent = v;
        return td;
      });
      tr.append(...elements);
      return tr;
    });
    tbody.append(...content);
    return tbody;
  }
}

customElements.define("table-component", TableComponent);
