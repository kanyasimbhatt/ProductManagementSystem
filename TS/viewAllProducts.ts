import { ProductBody } from "./addProducts.js";

class ViewProducts {
  constructor(allProducts: ProductBody[]) {
    this.viewAllProducts(allProducts);
    document
      .getElementsByClassName("sort-by-name")[0]
      .addEventListener("click", () => {
        this.sortByName();
      });

    document
      .getElementsByClassName("sort-by-pricelh")[0]
      .addEventListener("click", () => {
        this.sortByPriceLH();
      });

    document
      .getElementsByClassName("sort-by-pricehl")[0]
      .addEventListener("click", () => {
        this.sortByPriceHL();
      });

    const searchInputElement = document.getElementsByClassName(
      "search-product-name"
    )[0]! as HTMLInputElement;

    searchInputElement.value = "";
    searchInputElement.addEventListener("input", (event) => {
      this.debounceSearchProduct(event, allProducts, 300);
    });
  }

  debounceSearchProduct(
    event: Event,
    allProducts: ProductBody[],
    timer: number
  ) {
    let debounceTimer;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      this.searchProduct(event, allProducts);
    }, timer);
  }

  searchProduct(event: Event, allProducts: ProductBody[]) {
    let searchedInput: string = "";

    if ("value" in event.target! && typeof event.target!.value === "string")
      searchedInput = event.target!.value;

    if (searchedInput === "") this.viewAllProducts(allProducts);

    allProducts = allProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchedInput.toLowerCase());
    });
    if (allProducts.length === 0) {
      document.getElementsByClassName("all-products")[0].innerHTML =
        "<b> No Products found</b>";
    } else this.viewAllProducts(allProducts);
  }

  async sortByPriceLH() {
    let productArray: ProductBody[] = [];
    await fetch("http://localhost:3000/products", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        productArray = data;
      });

    productArray = productArray.sort((a, b) => a.price - b.price);
    this.viewAllProducts(productArray);
  }

  async sortByPriceHL() {
    let productArray: ProductBody[] = [];
    await fetch("http://localhost:3000/products", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        productArray = data;
      });

    productArray = productArray.sort((a, b) => b.price - a.price);
    this.viewAllProducts(productArray);
  }

  async sortByName() {
    let productArray: ProductBody[] = [];
    await fetch("http://localhost:3000/products", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        productArray = data;
      });

    productArray = productArray.sort((a, b) => a.title.localeCompare(b.title));
    this.viewAllProducts(productArray);
  }

  async viewAllProducts(allProducts: ProductBody[]) {
    const productDisplayElement = document.getElementsByClassName(
      "all-products"
    )[0]! as HTMLElement;

    if (allProducts.length === 0) {
      productDisplayElement.innerHTML += `<b>No Products Yet</b>`;
      return;
    }

    let htmlcode = "";
    allProducts.forEach((product) => {
      let productObj = product as ProductBody;

      htmlcode += `
            <a class = "text-decoration-none text-dark" href = "./viewProduct.html?productID=${
              productObj[`id`]
            }">
              <div class="card mb-2 ms-md-5 bg-light shadow-sm" style="width: 18rem">
              <div class = "card-image-wrapper">
                <img class="card-img-top" src="${
                  productObj["image"]
                }" alt="Card image cap"></div>
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <h5 class="card-title h-20">${productObj["title"]}</h5>
            <p class="card-text text-center h-20">
              Price: &#8377;${productObj["price"]}
            </p>
  
                <div class = "d-flex flex-row gap-5 m-4 h-40">
            <a href="#" id = "${
              productObj["id"]
            }" class="btn btn-warning justify-content-start delete-product-button">Delete</a>
            <a href="./addProducts.html?productID=${
              productObj["id"]
            }" class="btn btn-warning justify-content-end">Edit</a>
            </div>
            </div>
            </div>
        </a>
            `;
    });

    productDisplayElement.innerHTML = htmlcode;

    document.querySelectorAll(".delete-product-button").forEach((element) => {
      element.addEventListener("click", (event) => {
        if ("id" in event.target!)
          this.deleteProduct(event.target!.id as string);
      });
    });
  }

  deleteProduct(productId: string) {
    let productToDeleteId: string = productId;

    fetch(`http://localhost:3000/products/${productToDeleteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let allProducts: ProductBody[] = [];

  await fetch("http://localhost:3000/products", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;
    });
  new ViewProducts(allProducts);
});
