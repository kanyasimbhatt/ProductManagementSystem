export function handleWebpageConfiguration() {
  let currentURL: string = document.URL;

  const searchParams = new URLSearchParams(currentURL);
  let productID: string = "";
  for (const p of searchParams) {
    productID = p[1];
  }
  return productID;
}
