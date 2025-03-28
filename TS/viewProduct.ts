import { handleWebpageConfiguration } from "./webPageConfiguration";
import { ProductBody } from "./addProducts";
document.addEventListener("DOMContentLoaded", () => {
  let productId: string = handleWebpageConfiguration();
  const editButton = document.getElementsByClassName(
    "edit-current-product"
  )[0]! as HTMLAnchorElement;
  editButton.href = `./addProducts.html?productID=${productId}`;
  handleShowProduct(productId);
});

async function handleShowProduct(productId: string) {
  let ProductToDisplay: ProductBody = {
    id: "",
    title: "",
    description: "",
    price: 0,
    image: "",
  };

  await fetch(`http://localhost:3000/products/${productId}`)
    .then((response) => response.json())
    .then((data) => {
      ProductToDisplay = data;
    });

  const displayImageElement = document.getElementsByClassName(
    "product-image"
  )[0]! as HTMLImageElement;

  displayImageElement.style.height = "500px";

  const displayTitleElement = document.getElementsByClassName(
    "product-title"
  )[0]! as HTMLElement;

  const displayPriceElement = document.getElementsByClassName(
    "product-price"
  )[0]! as HTMLElement;
  const displayDescriptionElement = document.getElementsByClassName(
    "product-description"
  )[0]! as HTMLElement;

  displayImageElement.src = ProductToDisplay.image;
  displayTitleElement.textContent = ProductToDisplay.title;
  displayDescriptionElement.textContent = ProductToDisplay.description;
  displayPriceElement.textContent = `${ProductToDisplay.price}`;
}
