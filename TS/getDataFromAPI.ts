import { ProductBody } from "./commonUsedTypeInterface";

export async function getRequestDataFromAPI(): Promise<ProductBody[]> {
  const response = await fetch(
    "https://json-server-backend-for-crud-application.onrender.com/products",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("failed to fetch resource");
  }

  const data: ProductBody[] = await response.json();

  return data;
}

export async function getSingleProductBasedOnId(
  productID: string
): Promise<ProductBody> {
  const response = await fetch(
    `https://json-server-backend-for-crud-application.onrender.com/products/${productID}`
  );

  if (!response.ok) {
    throw new Error("failed to fetch resource");
  }

  let data = await response.json();
  return data;
}
