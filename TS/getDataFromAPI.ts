import { ProductBody } from "./commonUsedTypeInterface";
let limit: number = 11;
let limitStart: number = 1;
export async function getRequestDataFromAPI(): Promise<ProductBody[]> {
  const response = await fetch(
    `https://json-server-backend-for-crud-application.onrender.com/products`,
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
  let newArray: ProductBody[] = [];
  for (let i = limitStart; i < limitStart + limit; i++) {
    if (i < data.length) newArray.push(data[i]);
    else break;
  }

  limitStart = limitStart + limit;

  return newArray;
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
