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
  productImageURL: HTMLInputElement;
  imageValidationData: HTMLParagraphElement;
  urlValidationData: HTMLParagraphElement;
  productDisplayElement: HTMLElement;
  searchNameElement: HTMLInputElement;
  searchDescriptionElement: HTMLInputElement;
  displayImageElement: HTMLImageElement;
  displayTitleElement: HTMLElement;
  displayPriceElement: HTMLElement;
  displayDescriptionElement: HTMLElement;
  editButton: HTMLAnchorElement;
  sortOrderElement: HTMLSelectElement;
  sortByElement: HTMLSelectElement;
};

export const htmlElements: Readonly<HtmlElementType> = {
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

  productImageURL: document.getElementsByClassName(
    "product-image-URL"
  )[0] as HTMLInputElement,

  imageValidationData: document.getElementsByClassName(
    "validate-image"
  )[0] as HTMLParagraphElement,
  urlValidationData: document.getElementsByClassName(
    "validate-image-url"
  )[0] as HTMLParagraphElement,
  productDisplayElement: document.getElementsByClassName(
    "all-products"
  )[0] as HTMLElement,
  searchNameElement: document.getElementsByClassName(
    "search-product-name"
  )[0] as HTMLInputElement,
  searchDescriptionElement: document.getElementsByClassName(
    "search-product-description"
  )[0] as HTMLInputElement,
  displayImageElement: document.getElementsByClassName(
    "product-image"
  )[0] as HTMLImageElement,
  displayTitleElement: document.getElementsByClassName(
    "product-title"
  )[0] as HTMLElement,
  displayPriceElement: document.getElementsByClassName(
    "product-price"
  )[0] as HTMLElement,
  displayDescriptionElement: document.getElementsByClassName(
    "product-description"
  )[0] as HTMLElement,
  editButton: document.getElementsByClassName(
    "edit-current-product"
  )[0] as HTMLAnchorElement,
  sortOrderElement: document.getElementsByClassName(
    "sort-order-dropdown"
  )[0] as HTMLSelectElement,
  sortByElement: document.getElementsByClassName(
    "sort-by-dropdown"
  )[0] as HTMLSelectElement,
};
