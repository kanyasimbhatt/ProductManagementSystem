import { htmlElements } from "./commonUsedTypeInterface";
import { ProductBody } from "./commonUsedTypeInterface";
import { getRequestDataFromAPI } from "./getDataFromAPI";
import { ViewProducts } from "./viewAllProducts";
//added to induce sorting functionality
export async function sortByPriceLH(
  this: ViewProducts,
  productsArray: Set<ProductBody>
) {
  let productArray: ProductBody[] = [...productsArray];

  productArray = productArray.sort((a, b) => a.price - b.price);
  htmlElements.productDisplayElement.innerHTML = "";
  this.viewAllProducts(productArray);
}

export async function sortByPriceHL(
  this: ViewProducts,
  productsArray: Set<ProductBody>
) {
  let productArray: ProductBody[] = [...productsArray];

  productArray = productArray.sort((a, b) => b.price - a.price);
  htmlElements.productDisplayElement.innerHTML = "";
  this.viewAllProducts(productArray);
}

export async function sortByNameLH(
  this: ViewProducts,
  productsArray: Set<ProductBody>
) {
  let productArray: ProductBody[] = [...productsArray];

  productArray = productArray.sort((a, b) => a.title.localeCompare(b.title));
  htmlElements.productDisplayElement.innerHTML = "";
  this.viewAllProducts(productArray);
}

export async function sortByNameHL(
  this: ViewProducts,
  productsArray: Set<ProductBody>
) {
  let productArray: ProductBody[] = [...productsArray];

  productArray = productArray.sort((a, b) => b.title.localeCompare(a.title));
  htmlElements.productDisplayElement.innerHTML = "";
  this.viewAllProducts(productArray);
}
