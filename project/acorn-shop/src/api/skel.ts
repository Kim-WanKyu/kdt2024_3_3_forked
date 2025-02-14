const API_BASE_URL = process.env.REACT_APP_API_URL;

export class CustomHTTPError extends Error {
  status: number; // status 속성을 추가

  constructor(message: string, status: number) {
    super(message); // Error 생성자 호출
    this.name = "CustomHTTPError"; // 오류 이름 설정
    this.status = status; // status 설정
  }
}

const fetchData = async (url: string, options: RequestInit = {}) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  console.log("fetchData - Full URL:", fullUrl);

  // 헤더 "Content-Type": "application/json" 설정.
  const headers = { ...options.headers, "Content-Type": "application/json" };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    console.log("fetchData - Response:", response); // 응답 디버깅.
    if (!response.ok) {
      // 응답이 OK가 아니면, 응답 에러.
      throw new CustomHTTPError("fetchData error", response.status);
    }

    return response.json();
  } catch (error) {
    // fetchData error.
    if (error instanceof TypeError) {
      // fetch() 자체 에러. 네트워크 요청 에러. 0.
      console.error("Network Error (Failed to fetch):", error.message);
      throw new CustomHTTPError("Network error (Failed to fetch)", 0);
    } else if (error instanceof CustomHTTPError) {
      // fetch() 는 했는데, 응답이 에러. 400, 404, 500 등.
      console.error(`${error.message} ::: ${error.status}`);
      throw error;
    } else {
      // 그 외 에러. -1.
      console.error("Unknown Fetch Error:", error);
      throw new CustomHTTPError("Unknown fetchData error", -1);
    }
  }
};

/** GET 요청 함수. */
export const getData = async (url: string, headers = {}) => {
  return fetchData(url, {
    method: "GET",
    headers,
  }).catch((e) => {
    console.error("getData error : ", e);
    throw new CustomHTTPError("getData error", e.status);
  });
};

/** POST 요청 함수. */
export const postData = async (url: string, body: object, headers = {}) => {
  console.log("postData - Request:", { url, body, headers }); // 요청 디버깅
  const jsonBody = JSON.stringify(body);
  console.log("postData - JSON Body: ", jsonBody);
  return fetchData(url, {
    method: "POST",
    headers,
    body: jsonBody,
  }).catch((e) => {
    console.error("postData error : ", e);
    throw new CustomHTTPError("postData error", e.status);
  });
};

/** PUT 요청 함수. */
export const putData = async (url: string, body: object, headers = {}) => {
  return fetchData(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  }).catch((e) => {
    console.error("putData error : ", e);
    throw new CustomHTTPError("putData error", e.status);
  });
};

/** DELETE 요청 함수. */
export const deleteData = async (url: string, headers = {}) => {
  return fetchData(url, {
    method: "DELETE",
    headers,
  }).catch((e) => {
    console.error("deleteData error : ", e);
    throw new CustomHTTPError("deleteData error", e.status);
  });
};
