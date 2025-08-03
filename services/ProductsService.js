const url = new URL("http://localhost:8080/v1-producto");
const option = {
  method: "GET",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
};

export const getProducts = async () => {
  const response = await fetch(url.href, option).then((response) =>
    response.json()
  );
  const { content, numberOfElements, totalElements, totalPages } = response;
  console.log({ content, numberOfElements, totalElements, totalPages });
  return { content, numberOfElements, totalElements, totalPages };
};
