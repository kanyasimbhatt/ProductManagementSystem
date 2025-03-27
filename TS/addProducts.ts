import { log } from "console";
import validate from "../../../../node_modules/uuid/dist/cjs/validate";
import { handleWebpageConfiguration } from "./webPageConfiguration.js";
export interface ProductBody {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

type HtmlElementType = {
  productTitleElement: HTMLInputElement;
  productDescriptionElement: HTMLInputElement;
  productPriceElement: HTMLInputElement;
  formTitle: HTMLElement;
  addOrEditProductButton: HTMLButtonElement;
  previewImage: HTMLImageElement;
  productImageElement: HTMLInputElement;
};

const htmlElements: Readonly<HtmlElementType> = {
  productTitleElement: document.getElementsByClassName(
    "product-title"
  )[0] as HTMLInputElement,

  productDescriptionElement: document.getElementsByClassName(
    "product-description"
  )[0] as HTMLInputElement,

  productPriceElement: document.getElementsByClassName(
    "product-price"
  )[0] as HTMLInputElement,

  formTitle: document.getElementsByClassName("form-title")[0] as HTMLElement,

  addOrEditProductButton: document.getElementsByClassName(
    "add-button"
  )[0] as HTMLButtonElement,

  previewImage: document.getElementById(
    "img-from-local-storage"
  ) as HTMLImageElement,

  productImageElement: document.getElementsByClassName(
    "product-image"
  )[0] as HTMLInputElement,
};

class Products {
  imageReaderResult: string = "";
  pageInfo: string;
  data: ProductBody = {
    id: "",
    title: "",
    description: "",
    price: 0,
    image: "",
  };

  constructor() {
    //checking if the page is to work like edit or add

    let productID: string = handleWebpageConfiguration();

    this.pageInfo = !productID ? "Add" : "Edit";
    console.log(productID);

    //separate configuration for each type of page

    this.pageInfo === "Add"
      ? this.configureAdd()
      : this.configureEdit(productID);

    //common elements for image URL and file added by user
    const productImageElement = document.getElementsByClassName(
      "product-image"
    )[0] as HTMLInputElement;
    const imageURLElement = document.getElementsByClassName(
      "product-image-URL"
    )[0] as HTMLInputElement;

    //event listener for when user selects an image from it's own device
    productImageElement.addEventListener("change", (event) => {
      this.validateAndShowImage(event);

      if (productImageElement.value !== "") imageURLElement.disabled = true;
      else imageURLElement.disabled = false;
    });

    imageURLElement.addEventListener("input", (event) => {
      this.handleImageURLInput(event, productImageElement);
    });

    //initial value for all the inputs in form
    htmlElements.productTitleElement.value = "";
    htmlElements.productDescriptionElement.value = "";
    htmlElements.productPriceElement.value = "";
    htmlElements.productImageElement.value = "";
  }

  isValidImageURL(url: string, callback: Function) {
    let image = new Image();
    image.onload = () => callback(true);
    image.onerror = () => callback(false);
    image.src = url;
  }

  handleImageURLInput(event: Event, productImageElement: HTMLInputElement) {
    let imageURLInput = "";
    if ("value" in event.target!) {
      imageURLInput = `${event.target.value}`;
    } else return;

    if (imageURLInput !== "") {
      productImageElement.disabled = true;
    } else {
      htmlElements.previewImage.style.display = "none";
      productImageElement.disabled = false;
      document.getElementsByClassName("validate-image-url")[0].innerHTML = "";
    }
    this.isValidImageURL(imageURLInput, (outcome: boolean) => {
      if (outcome) {
        this.imageReaderResult = imageURLInput;
        this.displayPreviewImage();
        document.getElementsByClassName("validate-image-url")[0].innerHTML = "";
      } else {
        document.getElementsByClassName("validate-image-url")[0].innerHTML =
          "Enter a valid URL";
        htmlElements.previewImage.style.display = "none";
      }
    });
  }

  configureAdd() {
    document
      .getElementsByClassName("add-edit-product-form")[0]
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.addProducts();
        document.location.href = "./viewAllProducts.html";
      });
  }

  configureEdit(productID: string) {
    document
      .getElementsByClassName("add-edit-product-form")[0]
      .addEventListener("submit", (event) => {
        event.preventDefault();

        this.editProducts(productID);
        document.location.href = "./viewAllProducts.html";
      });

    htmlElements.formTitle.textContent = "Edit Products";
    htmlElements.addOrEditProductButton.textContent = "Apply Changes";

    fetch(`http://localhost:3000/products/${productID}`)
      .then((response) => response.json())
      .then((data) => {
        let productObj = data as ProductBody;
        this.data = productObj;
        console.log(data);

        htmlElements.productTitleElement.value = productObj.title;
        htmlElements.productDescriptionElement.value = productObj.description;
        htmlElements.productPriceElement.value = `${productObj.price}`;
        htmlElements.previewImage.src = productObj.image;
      })
      .catch((error) => console.log(error));
  }

  addProducts() {
    let productObj = {
      id: crypto.randomUUID(),
      title: htmlElements.productTitleElement.value,
      description: htmlElements.productDescriptionElement.value,
      price: +htmlElements.productPriceElement.value,
      image:
        this.imageReaderResult ||
        "https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg",
    };

    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productObj),
    });
  }

  validateAndShowImage(event: Event) {
    let image = event.target! as HTMLInputElement;
    let imageFile: File | null = null;

    if ("files" in image && image.files) {
      imageFile = image.files[0];
    }

    if (!imageFile) {
      const element = document.getElementById(
        "img-from-local-storage"
      ) as HTMLElement;
      element.style.display = "none";
      return;
    }
    const reader: FileReader = new FileReader();
    reader.addEventListener("load", () => {
      const validateImageInfo =
        document.getElementsByClassName("validate-image")[0];

      if (
        typeof reader.result === "string" &&
        reader.result.includes("image")
      ) {
        this.imageReaderResult = reader.result;

        this.displayPreviewImage();
        validateImageInfo.innerHTML = "";
      } else {
        htmlElements.previewImage.style.display = "none";
        validateImageInfo.innerHTML = "Enter a valid image";
      }
    });

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }

  displayPreviewImage() {
    htmlElements.previewImage.src = this.imageReaderResult;
    htmlElements.previewImage.style.height = "200px";

    htmlElements.previewImage.style.display = "block";
    htmlElements.previewImage.style.margin = "20px";
  }

  editProducts(productID: string) {
    fetch(`http://localhost:3000/products/${productID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: productID,
        title: htmlElements.productTitleElement.value,
        description: htmlElements.productDescriptionElement.value,
        price: +htmlElements.productPriceElement.value,
        image: htmlElements.previewImage.src || this.data.image,
      }),
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Products();
});
