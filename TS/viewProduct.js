var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleWebpageConfiguration } from "./webPageConfiguration.js";
document.addEventListener("DOMContentLoaded", () => {
    let productId = handleWebpageConfiguration();
    const editButton = document.getElementsByClassName("edit-current-product")[0];
    editButton.href = `./addProducts.html?productID=${productId}`;
    handleShowProduct(productId);
});
function handleShowProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        let ProductToDisplay = {
            id: "",
            title: "",
            description: "",
            price: 0,
            image: "",
        };
        yield fetch(`http://localhost:3000/products/${productId}`)
            .then((response) => response.json())
            .then((data) => {
            ProductToDisplay = data;
        });
        const displayImageElement = document.getElementsByClassName("product-image")[0];
        displayImageElement.style.height = "500px";
        const displayTitleElement = document.getElementsByClassName("product-title")[0];
        const displayPriceElement = document.getElementsByClassName("product-price")[0];
        const displayDescriptionElement = document.getElementsByClassName("product-description")[0];
        displayImageElement.src = ProductToDisplay.image;
        displayTitleElement.textContent = ProductToDisplay.title;
        displayDescriptionElement.textContent = ProductToDisplay.description;
        displayPriceElement.textContent = `${ProductToDisplay.price}`;
    });
}
