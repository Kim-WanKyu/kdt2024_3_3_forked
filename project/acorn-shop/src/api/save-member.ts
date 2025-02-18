import { getMemberData, postMemberData, putMemberData } from "./hello";
import { auth } from "../firebase";
import { CustomHTTPError } from "./skel";
import { IAddrPost, IAddrResponse } from "../pages/Register";
import { updateProfile } from "firebase/auth";

interface MemberData {
  uid: string;
  email: string;
  name: string;
  phone: string;
  bank: string;
  account: string;
  role: string;
  address: IAddrPost;
}

export interface MemberResponseData {
  memberId: string;
  email: string;
  name: string;
  phone: string;
  bank: string;
  account: string;
  role: string;
  blacked: boolean;
  createDate: string;
  updateDate: string;
  memberAddresses: Array<IAddrResponse>;
}

export interface MemberUpdateData {
  uid: string;
  name: string;
  phone: string;
  bank: string;
  account: string;
  // address: IAddrPost;
}

export const createMember = async (
  uid: string,
  email: string,
  name: string,
  phone: string,
  bank: string,
  account: string,
  address: IAddrPost,
  role: string
): Promise<MemberResponseData> => {
  try {
    const data = await postMemberData({
      uid: uid,
      email: email,
      name: name,
      phone: phone,
      bank: bank,
      account: account,
      address: address, // 주소(위치, 지역)는 보류...
      role: role,
    });

    // 성공.
    console.log("post member success: ", data);
    return data;
  } catch (error) {
    // 실패.
    if (error instanceof CustomHTTPError) {
      console.error("post member error: ", error, ":: ", error.status);
      throw new CustomHTTPError("post member error", error.status);
    }
    throw error;
  }
};

export const findMember = async (uid: string): Promise<MemberResponseData> => {
  try {
    const data = await getMemberData(uid);

    // 성공.
    console.log("get member success: ", data);
    return data;
  } catch (error) {
    // 실패.
    if (error instanceof CustomHTTPError) {
      console.error("get member error: ", error, "::status: ", error.status);
      throw new CustomHTTPError("get member error", error.status);
    }
    throw error;
  }
};

export const updateMember = async (
  uid: string,
  name: string,
  phone: string,
  bank: string,
  account: string
): Promise<MemberResponseData> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
    }

    const data = await putMemberData(uid, {
      name: name,
      phone: phone,
      bank: bank,
      account: account,
    });

    console.log("put member success: ", data);
    return data;
  } catch (error) {
    // 실패.
    if (error instanceof CustomHTTPError) {
      console.error("put member error: ", error);
      throw new CustomHTTPError("put member error", error.status);
    }
    throw error;
  }
};
