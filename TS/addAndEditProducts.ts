import { handleWebpageConfiguration } from "./webPageConfiguration";
import { ProductBody, htmlElements } from "./commonUsedTypeInterface";
import { getSingleProductBasedOnId } from "./getDataFromAPI";

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
    //added to check if the page is to work like edit or add
    let productID: string = handleWebpageConfiguration();

    this.pageInfo = !productID ? "Add" : "Edit";

    //to differentiate between configuration for each type of page
    this.pageInfo === "Add"
      ? this.configureAdd()
      : this.configureEdit(productID);

    //event listener for when user selects an image from it's own device
    htmlElements.productImageElement.addEventListener("change", (event) => {
      this.validateAndShowImage(event);

      if (htmlElements.productImageElement.value !== "") {
        htmlElements.productImageURL.disabled = true;
        htmlElements.urlValidationData.textContent = "";
      } else htmlElements.productImageURL.disabled = false;
    });

    htmlElements.productImageURL.addEventListener("input", (event) => {
      this.handleImageURLInput(event, htmlElements.productImageElement);
    });

    //added because on page the reload the content of the input page does not get removed
    htmlElements.productTitleElement.value = "";
    htmlElements.productDescriptionElement.value = "";
    htmlElements.productPriceElement.value = "";
    htmlElements.productImageElement.value = "";
  }

  //added to check if the image url added by user is valid or not
  isValidImageURL(url: string, callback: Function) {
    let image = new Image();
    image.onload = () => callback(true);
    image.onerror = () => callback(false);
    image.src = url;
  }

  //added to induce disable functionality between file image and the url plus to handle the scenario where the entered URL is invalid
  handleImageURLInput(event: Event, productImageElement: HTMLInputElement) {
    let imageURLInput = "";
    if ("value" in event.target!) {
      imageURLInput = `${event.target.value}`;
    } else return;

    if (imageURLInput !== "") {
      productImageElement.disabled = true;
      htmlElements.imageValidationData.textContent = "";
    } else {
      htmlElements.previewImage.style.display = "none";
      productImageElement.disabled = false;
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

  //added to induce basic setup required if the page is to act like add product page
  configureAdd() {
    document
      .getElementsByClassName("add-edit-product-form")[0]
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.addProducts();
      });
  }

  //added to induce basic setup required if the page is to act like edit product page, like display the product information
  async configureEdit(productID: string) {
    document
      .getElementsByClassName("add-edit-product-form")[0]
      .addEventListener("submit", (event) => {
        event.preventDefault();

        this.editProducts(productID);
      });

    htmlElements.formTitle.textContent = "Edit Products";
    htmlElements.addOrEditProductButton.textContent = "Apply Changes";
    try {
      let data: ProductBody = await getSingleProductBasedOnId(productID);
      let productObj = data;
      this.data = productObj;
      this.fillFormContentForEdit(productObj);
    } catch (err) {
      console.log(err);
    }
  }

  //added to make code less cluttered
  fillFormContentForEdit(productObj: ProductBody) {
    htmlElements.productTitleElement.value = productObj.title;
    htmlElements.productDescriptionElement.value = productObj.description;
    htmlElements.productPriceElement.value = `${productObj.price}`;
    htmlElements.previewImage.src = productObj.image;
    htmlElements.previewImage.style.display = "block";

    if (!productObj.image.includes("image")) {
      htmlElements.productImageURL.value = productObj.image;
    }
  }

  //added to store data in the json file when user wants to add data
  async addProducts() {
    let productObj = {
      id: crypto.randomUUID(),
      title: htmlElements.productTitleElement.value,
      description: htmlElements.productDescriptionElement.value,
      price: +htmlElements.productPriceElement.value,
      image:
        this.imageReaderResult ||
        "https://mmi-global.com/wp-content/uploads/2020/05/default-product-image.jpg",
    };

    await fetch(
      "https://json-server-backend-for-crud-application.onrender.com/products",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productObj),
      }
    );

    document.location.href = "./viewAllProducts.html";
  }

  //added to handle storing and displaying the image file using fileReader when user enters image from its own device
  validateAndShowImage(event: Event) {
    let image = event.target! as HTMLInputElement;
    let imageFile;

    if ("files" in image && image.files) {
      imageFile = image.files[0];
    }

    if (!imageFile) {
      htmlElements.previewImage.style.display = "none";
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
        console.log("sent enter valid image");
      }
    });

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }

  //added to handle viewing the preview image as multiple functions were doing the same
  displayPreviewImage() {
    htmlElements.previewImage.src = this.imageReaderResult;
    htmlElements.previewImage.style.display = "block";
  }

  //added to handle put request when user wants to edit data
  async editProducts(productID: string) {
    await fetch(
      `https://json-server-backend-for-crud-application.onrender.com/products/${productID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productID,
          title: htmlElements.productTitleElement.value,
          description: htmlElements.productDescriptionElement.value,
          price: +htmlElements.productPriceElement.value,
          image:
            htmlElements.previewImage.src ||
            htmlElements.productImageURL.value ||
            this.data.image,
        }),
      }
    );
    document.location.href = "./viewAllProducts.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Products();
});
