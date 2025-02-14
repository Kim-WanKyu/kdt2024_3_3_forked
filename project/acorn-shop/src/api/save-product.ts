import { getProductsData, postProductData } from "./hello";
import { MemberResponseData } from "./save-member";
import { CustomHTTPError } from "./skel";

export interface ProductData {
  productId: string;  // 상품 고유 id.
  seller: string;   // 판매자 uid.
  price: number;    // 가격.
  title: string;    // 제목.
  detail: string;   // 세부 설명.
  tradePlace: string;  // 거래희망주소.
  isDelivery: boolean;  // 직거래/배달 여부.
  isNegotiable: boolean;  // 가격 제안 가능 여부.
  category: string; // 상품카테고리명.(하나).
  productImages: ProductImageData[]; //  // 상품 이미지들.
}
export interface ProductImageData {
  [x: string]: any;
  imgName: string;  // 상품이미지 이름.
  imgUrl: string;   // 상품이미지 url.
}
export interface ProductCategory {
  id: number;
  name: string;
  createDate: string;
  updateDate: string;
}

export interface ProductResponseData {
  productId: string;
  seller: MemberResponseData;
  price: number;
  title: string;
  detail: string;
  category: ProductCategory; // category..
  productImages: Array<ProductImageResponseData>;
  tradePlace: string;
  isDelivery: boolean;
  isNegotiable: boolean;
  createDate: string;
  updateDate: string;
}
export interface ProductImageResponseData {
  imgName: string;
  imgUrl: string;
  createDate: string;
  updateDate: string;
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
export const createProduct = async (
  productId: string,  // 상품 고유 id.
  seller: string,   // 판매자 uid.
  price: number,    // 가격.
  title: string,    // 제목.
  detail: string,   // 세부 설명.
  tradePlace: string,  // 거래희망주소.
  isDelivery: boolean,  // 직거래/배달 여부.
  isNegotiable: boolean,  // 가격 제안 가능 여부.
  category: string, // 상품카테고리명.(하나).
  productImages: ProductImageData[] // 상품 이미지들...
): Promise<ProductResponseData> => {
  try {
    const data = await postProductData({
      productId: productId,
      seller: seller,
      price: price,
      title: title,
      detail: detail,
      tradePlace: tradePlace, // 주소(위치, 지역)는 보류...
      isDelivery: isDelivery,
      isNegotiable: isNegotiable,
      category: category,
      productImages: productImages,
    });

    // 성공.
    console.log("post product success: ", data);
    return data;
  } catch (error) {
    // 실패.
    if (error instanceof CustomHTTPError) {
      console.error("post product error: ", error, ":: ", error.status);
      throw new CustomHTTPError("post product error", error.status);
    }
    throw error;
  }
  
};

