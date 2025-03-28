import { handleWebpageConfiguration } from "./webPageConfiguration";
import { ProductBody, htmlElements } from "./commonUsedTypeInterface";
import { getSingleProductBasedOnId } from "./getDataFromAPI";
document.addEventListener("DOMContentLoaded", () => {
  let productId: string = handleWebpageConfiguration();
  htmlElements.editButton.href = `./addProducts.html?productID=${productId}`;
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
  try {
    const data: ProductBody = await getSingleProductBasedOnId(productId);

    ProductToDisplay = data;
  } catch (err) {
    console.log(err);
  }

  htmlElements.displayImageElement.style.height = "500px";

  htmlElements.displayImageElement.src = ProductToDisplay.image;
  htmlElements.displayTitleElement.textContent = ProductToDisplay.title;
  htmlElements.displayDescriptionElement.textContent =
    ProductToDisplay.description;
  htmlElements.displayPriceElement.textContent = `${ProductToDisplay.price}`;
}
