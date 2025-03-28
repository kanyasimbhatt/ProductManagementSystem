import { ProductBody, htmlElements } from "./commonUsedTypeInterface";
import { getRequestDataFromAPI } from "./getDataFromAPI";

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

    htmlElements.searchInputElement.value = "";
    htmlElements.searchInputElement.addEventListener("input", (event) => {
      this.debounceSearchProduct(event, allProducts, 1000);
    });

    window.addEventListener("scroll", () => this.handleScroll());
  }

  async handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 300) {
      try {
        const result = await getRequestDataFromAPI();

        this.viewAllProducts(result);
      } catch (err) {
        console.log(err);
      }
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
    console.log("hello");
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

  async sortByPriceLH() {
    let productArray: ProductBody[] = [];
    try {
      const data = await getRequestDataFromAPI();

      productArray = data;
    } catch (err) {
      console.log(err);
    }

    productArray = productArray.sort((a, b) => a.price - b.price);
    htmlElements.productDisplayElement.innerHTML = "";
    this.viewAllProducts(productArray);
  }

  async sortByPriceHL() {
    let productArray: ProductBody[] = [];
    try {
      const data = await getRequestDataFromAPI();

      productArray = data;
    } catch (err) {
      console.log(err);
    }
    productArray = productArray.sort((a, b) => b.price - a.price);
    htmlElements.productDisplayElement.innerHTML = "";
    this.viewAllProducts(productArray);
  }

  async sortByName() {
    let productArray: ProductBody[] = [];
    try {
      const data = await getRequestDataFromAPI();
      productArray = data;
    } catch (err) {
      console.log(err);
    }

    productArray = productArray.sort((a, b) => a.title.localeCompare(b.title));
    htmlElements.productDisplayElement.innerHTML = "";
    this.viewAllProducts(productArray);
  }

  async viewAllProducts(allProducts: ProductBody[]) {
    if (allProducts.length === 0) {
      htmlElements.productDisplayElement.innerHTML += `<b>No Products Yet</b>`;
      return;
    }

    let htmlcode = "";
    allProducts.forEach((product) => {
      let productObj: ProductBody = product;

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

    htmlElements.productDisplayElement.innerHTML += htmlcode;

    document.querySelectorAll(".delete-product-button").forEach((element) => {
      element.addEventListener("click", (event) => {
        if ("id" in event.target!)
          this.deleteProduct(event.target.id as string);
      });
    });
  }

  async deleteProduct(productId: string) {
    let productToDeleteId: string = productId;
    try {
      const response = await fetch(
        `https://json-server-backend-for-crud-application.onrender.com/products/${productToDeleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("failed to delete resource");
      }
    } catch (err) {
      console.log(err);
    }

    document.location.href = "./viewAllProducts.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let allProducts: ProductBody[] = [];

  try {
    const data = await getRequestDataFromAPI();

    allProducts = data;
  } catch (err) {
    console.log(err);
  }
  new ViewProducts(allProducts);
});
