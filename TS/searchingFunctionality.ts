//added to induce the search functionality
import { ViewProducts } from "./viewAllProducts";
import { htmlElements } from "./commonUsedTypeInterface";
import { ProductBody } from "./commonUsedTypeInterface";

export function searchProductName(
  this: ViewProducts,
  event: Event,
  allProducts: ProductBody[]
) {
  let searchedInput: string = "";

  if ("value" in event.target! && typeof event.target.value === "string")
    searchedInput = event.target.value;

  if (searchedInput === "") {
    htmlElements.productDisplayElement.innerHTML = "";

    this.viewAllProducts(allProducts);
  }
  allProducts = allProducts.filter((product) => {
    return product.title.toLowerCase().includes(searchedInput.toLowerCase());
  });
  if (allProducts.length === 0) {
    document.getElementsByClassName("all-products")[0].innerHTML =
      "<b> No Products found</b>";
  } else {
    htmlElements.productDisplayElement.innerHTML = "";

    this.viewAllProducts(allProducts);
  }
}

export function searchProductDescription(
  this: ViewProducts,
  event: Event,
  allProducts: ProductBody[]
) {
  let searchedInput: string = "";

  if ("value" in event.target! && typeof event.target.value === "string")
    searchedInput = event.target.value;

  if (searchedInput === "") {
    htmlElements.productDisplayElement.innerHTML = "";

    this.viewAllProducts(allProducts);
    return;
  }
  allProducts = allProducts.filter((product) => {
    return product.description
      .toLowerCase()
      .includes(searchedInput.toLowerCase());
  });

  if (allProducts.length === 0) {
    document.getElementsByClassName("all-products")[0].innerHTML =
      "<b> No Products found</b>";
  } else {
    htmlElements.productDisplayElement.innerHTML = "";
    this.viewAllProducts(allProducts);
  }
}
