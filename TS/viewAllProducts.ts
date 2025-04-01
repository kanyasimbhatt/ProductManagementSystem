import { ProductBody, htmlElements } from "./commonUsedTypeInterface";
import { getRequestDataFromAPI } from "./getDataFromAPI";
import {
  searchProductDescription,
  searchProductName,
} from "./searchingFunctionality";
import {
  sortByNameHL,
  sortByPriceHL,
  sortByPriceLH,
  sortByNameLH,
} from "./sortingFunctions";

export class ViewProducts {
  throttleLoad: Function = () => {};
  productArray = new Set<ProductBody>([]);

  constructor(allProducts: ProductBody[]) {
    this.viewAllProducts(allProducts);
    this.initialiseEventListner(allProducts);
    htmlElements.searchNameElement.value = "";
    htmlElements.searchDescriptionElement.value = "";
    this.throttleLoad = this.throttle.call(this, this.handleScroll, 3000);
  }

  initialiseEventListner(allProducts: ProductBody[]) {
    htmlElements.sortByElement.addEventListener("change", (event) => {
      if ("value" in event.target! && event.target.value === "name") {
        if (
          "value" in htmlElements.sortOrderElement &&
          htmlElements.sortOrderElement.value === "Descending"
        ) {
          sortByNameHL.call(this, this.productArray);
        } else {
          sortByNameLH.call(this, this.productArray);
        }
      } else if ("value" in event.target! && event.target.value === "price") {
        if (
          "value" in htmlElements.sortOrderElement &&
          htmlElements.sortOrderElement.value === "Descending"
        ) {
          sortByPriceHL.call(this, this.productArray);
        } else {
          sortByPriceLH.call(this, this.productArray);
        }
      } else {
        htmlElements.productDisplayElement.textContent = "";
        this.viewAllProducts([...this.productArray]);
      }
    });

    htmlElements.sortOrderElement.addEventListener("change", (event) => {
      if ("value" in event.target! && event?.target.value === "Descending") {
        if (
          "value" in htmlElements.sortByElement &&
          htmlElements.sortByElement.value === "name"
        ) {
          sortByNameHL.call(this, this.productArray);
        } else if (
          "value" in htmlElements.sortByElement &&
          htmlElements.sortByElement.value === "price"
        ) {
          sortByPriceHL.call(this, this.productArray);
        }
      } else {
        if (
          "value" in htmlElements.sortByElement &&
          htmlElements.sortByElement.value === "name"
        ) {
          sortByNameLH.call(this, this.productArray);
        } else if (
          "value" in htmlElements.sortByElement &&
          htmlElements.sortByElement.value === "price"
        ) {
          sortByPriceLH.call(this, this.productArray);
        }
      }
    });

    htmlElements.searchDescriptionElement.addEventListener("input", (event) => {
      this.debounceSearchProductDescription(
        event,
        [...this.productArray],
        1000
      );
    });

    htmlElements.searchNameElement.addEventListener("input", (event) => {
      this.debounceSearchProductName(event, [...this.productArray], 1000);
    });

    //added for infinite scrolling
    document.addEventListener("scroll", () => {
      if (
        htmlElements.productDisplayElement.scrollHeight - window.scrollY <
        1200
      ) {
        this.throttleLoad();
      }
    });
  }

  throttle(func: Function, duration: number) {
    let flag = true;

    return (...args: any[]) => {
      if (flag) {
        func.call(this, ...args);
        flag = false;
        setTimeout(() => {
          flag = true;
        }, duration);
      }
    };
  }

  //added to check if the user has reached to end of the page to induce infinite scrolling
  async handleScroll() {
    try {
      const result = await getRequestDataFromAPI();
      if (result.length === 0) return;
      console.log(result);
      this.viewAllProducts(result)!;
    } catch (err) {
      console.log(err);
    }
  }

  //added to induce debouncing
  debounceSearchProductDescription(
    event: Event,
    allProducts: ProductBody[],
    timer: number
  ) {
    let debounceTimer;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      searchProductDescription.call(this, event, allProducts);
    }, timer);
  }

  //added to induce debouncing
  debounceSearchProductName(
    event: Event,
    allProducts: ProductBody[],
    timer: number
  ) {
    let debounceTimer;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      searchProductName.call(this, event, allProducts);
    }, timer);
  }

  //added to display the passed products array as set of cards so that user can view them
  async viewAllProducts(allProducts: ProductBody[]) {
    if (
      allProducts.length === 0 &&
      htmlElements.productDisplayElement.textContent === ""
    ) {
      htmlElements.productDisplayElement.innerHTML += `<b>No Products Yet</b>`;
      return;
    }

    let htmlcode = "";
    allProducts.forEach((product) => {
      let productObj: ProductBody = product;
      this.productArray.add(productObj);
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
            <a href="./addAndEditProducts.html?productID=${
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

  //added to handle delete product functionality
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
  //added to show initial set of products
  try {
    const data = await getRequestDataFromAPI();

    allProducts = data;
  } catch (err) {
    console.log(err);
  }
  new ViewProducts(allProducts);
});
