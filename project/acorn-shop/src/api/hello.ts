import { IAddrPost } from "../pages/Register";
import { ProductImageData } from "./save-product";
import { deleteData, getData, postData, putData } from "./skel";

/** ~/api/hello GET 요청 함수. */
export const getHelloData = async (headers = {}) => {
  try {
    return await getData('/api/hello', headers);
  } catch (error) {
    console.log('hello get error: ',error);
    throw error;
  }
};

/** ~/member POST 요청 함수. */
export const postMemberData = async (body: { uid: string; email: string; name: string; phone: string; bank: string; account: string; address: IAddrPost; role: string; }, headers = {}) => {
  try {
    return await postData('/api/member', body, headers);
  } catch (error) {
    console.log('member post error: ',error);
    throw error;
  }
}

/** ~/member PUT 요청 함수. */
export const putMemberData = async (uid: string, body: { name: string; phone: string; bank: string; account: string; }, headers = {}) => {
  try {
    return await putData(`/api/member/${uid}`, body, headers);
  } catch (error) {
    console.log('member put error: ',error);
    throw error;
  }
}

/** ~/member/{uid} GET 요청 함수. */
export const getMemberData = async (uid: string, headers = {}) => {
  try {
    return await getData(`/api/member/${uid}`, headers);
  } catch (error) {
    console.error('member/{uid} get error: ',error);
    throw error;
  }
}

/** ~/member/{uid} DELETE 요청 함수. */
export const deleteMemberData = async (uid: string, headers = {}) => {
  try {
    return await deleteData(`/api/member/${uid}`, headers);
  } catch (error) {
    console.log('member/{uid} delete error: ',error);
    throw error;
  }
}


/** ~/product POST 요청 함수. */
export const postProductData = async (body: {productId: string, seller: string, price: number, title: string, detail: string, tradePlace: string, isDelivery: boolean, isNegotiable: boolean, category: string, productImages: ProductImageData[]}, headers = {}) => {
  try {
    return await postData('/api/product', body, headers);
  } catch (error) {
    console.log('product post error: ',error);
    throw error;
  }
}

/** ~/product GET 요청 함수. */
export const getProductsData = async (page: number, size: number, headers = {}) => {
  try {
    return await getData(`/api/product?page=${page}&size=${size}`, headers);
  } catch (error) {
    console.log('product get error: ',error);
    throw error;
  }
}