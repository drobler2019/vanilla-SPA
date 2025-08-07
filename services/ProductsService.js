const url = new URL("http://localhost:8080/v1-producto");
const option = {
  method: "GET",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
};

export const getProducts = async (page = 0) => {
  url.searchParams.set("page", page);
  return await fetch(url.href, option)
    .then((response) => response.json())
    .then((response) => {
      const { content, numberOfElements, totalElements, totalPages } = response;
      return { content, numberOfElements, totalElements, totalPages };
    })
    .catch(() => ({
      content: [],
      numberOfElements: 0,
      totalElements: 0,
      totalPages: 0,
    }));
};
