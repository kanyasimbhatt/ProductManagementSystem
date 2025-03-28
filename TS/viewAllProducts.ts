import { log } from "console";
import { ProductBody } from "./addProducts";

class ViewProducts {
  searchInputElement: HTMLInputElement;
  productDisplayElement: HTMLElement;
  constructor(allProducts: ProductBody[]) {
    this.productDisplayElement = document.getElementsByClassName(
      "all-products"
    )[0]! as HTMLElement;
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

    this.searchInputElement = document.getElementsByClassName(
      "search-product-name"
    )[0]! as HTMLInputElement;

    this.searchInputElement.value = "";
    this.searchInputElement.addEventListener("input", (event) => {
      this.debounceSearchProduct(event, allProducts, 300);
    });

    window.addEventListener("scroll", () => this.handleScroll());
  }

  async handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 300) {
      let response = await fetch("http://localhost:3000/products", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("data not fetched");
        return;
      }

      const result = await response.json();

      this.viewAllProducts(result);
    }
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

    if (searchedInput === "") {
      this.productDisplayElement.innerHTML = "";

      this.viewAllProducts(allProducts);
    }
    allProducts = allProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchedInput.toLowerCase());
    });
    if (allProducts.length === 0) {
      document.getElementsByClassName("all-products")[0].innerHTML =
        "<b> No Products found</b>";
    } else {
      this.productDisplayElement.innerHTML = "";

      this.viewAllProducts(allProducts);
    }
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
    this.productDisplayElement.innerHTML = "";
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
    this.productDisplayElement.innerHTML = "";
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
    this.productDisplayElement.innerHTML = "";
    this.viewAllProducts(productArray);
  }

  async viewAllProducts(allProducts: ProductBody[]) {
    if (allProducts.length === 0) {
      this.productDisplayElement.innerHTML += `<b>No Products Yet</b>`;
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

    this.productDisplayElement.innerHTML += htmlcode;

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

    document.location.href = "./viewAllProducts.html";
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
