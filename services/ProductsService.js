const url = new URL("http://localhost:8080/v1-producto");
const option = {
  method: "GET",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
};

export const getProducts = async () => {
  return await fetch(url.href, option)
    .then((response) => response.json())
    .then((json) => json.content);
};
