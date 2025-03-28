import { handleWebpageConfiguration } from "./webPageConfiguration";
import { ProductBody, htmlElements } from "./commonUsedTypeInterface";
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

  await fetch(
    `https://json-server-backend-for-crud-application.onrender.com/products/${productId}`
  )
    .then((response) => response.json())
    .then((data) => {
      ProductToDisplay = data;
    });

  htmlElements.displayImageElement.style.height = "500px";

  htmlElements.displayImageElement.src = ProductToDisplay.image;
  htmlElements.displayTitleElement.textContent = ProductToDisplay.title;
  htmlElements.displayDescriptionElement.textContent =
    ProductToDisplay.description;
  htmlElements.displayPriceElement.textContent = `${ProductToDisplay.price}`;
}
