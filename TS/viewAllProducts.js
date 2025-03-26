var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ViewProducts {
    constructor() {
        this.viewAllProducts();
    }
    viewAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const productDisplayElement = document.getElementsByClassName("all-products")[0];
            let allProducts = [];
            yield fetch("http://localhost:3000/products", {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                allProducts = data;
            });
            if (allProducts.length === 0) {
                productDisplayElement.innerHTML += `<b>No Products Yet</b>`;
                return;
            }
            let htmlcode = "";
            allProducts.forEach((product) => {
                let productObj = product;
                htmlcode += `
            <a class = "text-decoration-none text-dark" href = "./viewProduct.html?productID=${productObj[`id`]}">
              <div class="card mb-2 bg-light shadow-sm" style="width: 18rem">
                <img class="card-img-top" src="${productObj["image"]}" alt="Card image cap">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <h5 class="card-title h-20">${productObj["title"]}</h5>
            <p class="card-text text-center h-20">
              Price: ${productObj["price"]}&#8377;
            </p>
  
                <div class = "d-flex flex-row gap-5 m-4 h-40">
            <a href="#" id = "${productObj["id"]}" class="btn btn-warning justify-content-start delete-product-button">Delete</a>
            <a href="./addProducts.html?productID=${productObj["id"]}" class="btn btn-warning justify-content-end">Edit</a>
            </div>
            </div>
            </div>
        </a>
            `;
            });
            productDisplayElement.innerHTML += htmlcode;
            document.querySelectorAll(".delete-product-button").forEach((element) => {
                element.addEventListener("click", (event) => {
                    if ("id" in event.target)
                        this.deleteProduct(event.target.id);
                });
            });
        });
    }
    deleteProduct(productId) {
        let productToDeleteId = productId;
        fetch(`http://localhost:3000/products/${productToDeleteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new ViewProducts();
});
export {};
