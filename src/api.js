import axios from "axios";

export function getProductList(sortBy, order, page) {
  let url = "https://dummyjson.com/products?limit=12";
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  if (page) {
    url += `&skip=${(page - 1) * 12}`;
  }
  return axios.get(url).then((response) => response.data);
}

export function getProduct(id) {
  return axios
    .get(`https://dummyjson.com/products/${id}`)
    .then((response) => response.data);
}

export function searchProducts(query, sortBy, order, page) {
  let url = `https://dummyjson.com/products/search?q=${query}&limit=12`;
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  if (page) {
    url += `&skip=${(page - 1) * 12}`;
  }
  return axios.get(url).then((response) => response.data);
}

export function signupUser(firstName, email, password) {
  const url = "https://r5ftltl6sj.execute-api.us-east-1.amazonaws.com/signup";
  const data = {
    firstName,
    email,
    password,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  };

  return axios
    .post(url, data, config)
    .then((response) => {
      if (response.status >= 400) {
        const errorMessage = response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      return response.data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}

export function signInUser(email, password) {
  const url = "https://r5ftltl6sj.execute-api.us-east-1.amazonaws.com/signin";
  const data = {
    email,
    password,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  };

  return axios
    .post(url, data, config)
    .then((response) => {
      if (response.status >= 400) {
        const errorMessage = response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      return response.data;
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}
