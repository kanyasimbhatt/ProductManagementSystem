export function handleWebpageConfiguration() {
    let currentURL = document.URL;
    const searchParams = new URLSearchParams(currentURL);
    let productID = "";
    for (const p of searchParams) {
        productID = p[1];
    }
    return productID;
}
