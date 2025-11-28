import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import NoMatch from "../components/NoMatch.jsx";
import Loading from "../components/Loading.jsx";
import { getProductList, searchProducts } from "../api.js";

function ProductsPage() {
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries([...searchParams]);
  const page = +params.page || 1;
  const query = params.query || "";
  const sort = params.sort || "default";

  useEffect(
    function () {
      let sortBy;
      let order;

      if (sort === "title") {
        sortBy = "title";
        order = "asc";
      } else if (sort === "price-asc") {
        sortBy = "price";
        order = "asc";
      } else if (sort === "price-desc") {
        sortBy = "price";
        order = "desc";
      }

      setLoading(true);
      const promise = query
        ? searchProducts(query, sortBy, order, page)
        : getProductList(sortBy, order, page);
      promise
        .then(function (data) {
          setProductData(data);
          setLoading(false);
        })
        .catch(function (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    },
    [query, sort, page]
  );

  const lastPage = Math.ceil(productData.total / 12);

  const rangeStart = Math.max(1, page - 3);
  const rangeEnd = Math.min(lastPage, page + 3);

  const pageNumbers = [];

  if (rangeStart > 1) {
    pageNumbers.push(1);
    if (rangeStart > 2) {
      pageNumbers.push("...");
    }
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pageNumbers.push(i);
  }

  if (rangeEnd < lastPage) {
    if (rangeEnd < lastPage - 1) {
      pageNumbers.push("...");
    }
    pageNumbers.push(lastPage);
  }

  const pages = pageNumbers.map((pageNo, index) => {
    if (pageNo === "...") {
      return (
        <div
          key={index}
          className="flex justify-center items-center bg-white border border-primary-dark w-8 h-8 text-primary-dark"
        >
          ...
        </div>
      );
    }

    return (
      <Link
        to={"?" + new URLSearchParams({ ...params, page: pageNo })}
        className={
          "border border-primary-dark w-8 h-8 flex items-center justify-center " +
          (pageNo === page
            ? "bg-primary-dark text-white"
            : "bg-white text-primary-dark hover:bg-primary-dark hover:text-white")
        }
        key={pageNo}
      >
        {pageNo}
      </Link>
    );
  });

  const handleSearch = (newQuery) => {
    setSearchParams(
      { ...params, query: newQuery, page: 1 },
      { replace: false }
    );
  };

  const handleSort = (newSort) => {
    setSearchParams({ ...params, sort: newSort }, { replace: false });
  };

  const handleClearSearch = () => {
    setSearchParams({ ...params, query: "", page: 1 }, { replace: false });
  };

  return (
    <div className="bg-white mx-auto my-8 md:my-16 px-9 py-8 max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
      <div className="flex flex-col gap-4">
        <p className="text-gray-400 text-xs">Home / Shop</p>
        <h1 className="mb-4 text-primary-light text-4xl">Shop</h1>
        <Filter
          query={query}
          sort={sort}
          onSearch={handleSearch}
          onSort={handleSort}
        />
      </div>
      {loading && <Loading />}
      {!loading && productData.products.length > 0 && (
        <>
          <ProductGrid products={productData.products} />
          <div className="flex gap-1 mt-8">
            {page > 1 && (
              <Link
                to={"?" + new URLSearchParams({ ...params, page: page - 1 })}
                className={
                  "border border-primary-dark w-8 h-8 text-center bg-white text-primary-dark hover:bg-primary-dark hover:text-white"
                }
              >
                ↼
              </Link>
            )}
            {pages}
            {page < lastPage && (
              <Link
                to={"?" + new URLSearchParams({ ...params, page: page + 1 })}
                className={
                  "border border-primary-dark w-8 h-8 text-center bg-white text-primary-dark hover:bg-primary-dark hover:text-white"
                }
              >
                ⇁
              </Link>
            )}
          </div>
        </>
      )}
      {!loading && productData.products.length === 0 && (
        <NoMatch searchQuery={query} onClearSearch={handleClearSearch} />
      )}
    </div>
  );
}

export default ProductsPage;
