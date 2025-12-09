import axios from "axios";

export function getProductList(sortBy, order, page) {
  let url = "https://dummyjson.com/products?limit=12";
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  if (page) {
    url += `&skip=${(page - 1) * 12}`;
  }
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}

export function getProduct(id) {
  return axios
    .get(`https://dummyjson.com/products/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}

// url doesnt work now, will get it back if possible
// export function getCartProducts(ids) {
//   const commaSeparatedIds = ids.join(",");
//   const url = `https://r5ftltl6sj.execute-api.us-east-1.amazonaws.com/products/bulk?ids=[${commaSeparatedIds}]`;
//   return axios.get(url).then((response) => response.data.products);
// }

export function searchProducts(query, sortBy, order, page) {
  let url = `https://dummyjson.com/products/search?q=${query}&limit=12`;
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  if (page) {
    url += `&skip=${(page - 1) * 12}`;
  }
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}

export function getProductIds(sortBy, order) {
  let url = "https://dummyjson.com/products?limit=0&select=id";
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
}

export function searchProductIds(query, sortBy, order) {
  let url = `https://dummyjson.com/products/search?q=${query}&limit=0&select=id`;
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        throw new Error(errorMessage);
      }
      throw error;
    });
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

export function saveCart(cart, token) {
  const url = "https://r5ftltl6sj.execute-api.us-east-1.amazonaws.com/cart";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
  };

  return axios
    .post(url, cart, config)
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

export function getCart(token) {
  const url = "https://r5ftltl6sj.execute-api.us-east-1.amazonaws.com/cart";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
  };

  return axios
    .get(url, config)
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
