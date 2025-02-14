import React, { FC, JSX, useState, useRef } from "react";

const DeliveryMain: FC = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 수정 중인 필드 상태
  const [editingField, setEditingField] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "김철수",
    account: "계좌번호 00000000",
    phone: "010-1234-5678",
    email: "asdf1234@gmail.com",
    profileImage:
      "https://media.vlpt.us/images/holim0/post/7d80e99d-11bc-4327-b16d-324a8daa0014/image.png",
  });

  // Base64 변환 함수
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = await convertToBase64(file);
      setValues((prev) => ({ ...prev, profileImage: base64 }));
    }
  };

  // 일반 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [editingField!]: e.target.value });
  };

  return (
    <div>
      <h3>배달부 정보</h3>

      {/* 프로필 사진 */}
      <div>
        <img
          src={values.profileImage}
          alt="배달부 사진"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <button onClick={() => fileInputRef.current?.click()}>수정</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* 이름 */}
      <div>
        {editingField === "name" ? (
          <>
            <input type="text" value={values.name} onChange={handleChange} />
            <button onClick={() => setEditingField(null)}>확인</button>
          </>
        ) : (
          <>
            <div>{values.name}</div>
            <button onClick={() => setEditingField("name")}>수정</button>
          </>
        )}
      </div>

      <div>아이디</div>

      {/* 계좌번호 */}
      <div>
        <h4>계좌번호</h4>
        {editingField === "account" ? (
          <>
            <input type="text" value={values.account} onChange={handleChange} />
            <button onClick={() => setEditingField(null)}>확인</button>
          </>
        ) : (
          <>
            <p>{values.account}</p>
            <button onClick={() => setEditingField("account")}>수정</button>
          </>
        )}
      </div>

      {/* 전화번호 */}
      <div>
        <h4>전화번호</h4>
        {editingField === "phone" ? (
          <>
            <input type="text" value={values.phone} onChange={handleChange} />
            <button onClick={() => setEditingField(null)}>확인</button>
          </>
        ) : (
          <>
            <p>{values.phone}</p>
            <button onClick={() => setEditingField("phone")}>수정</button>
          </>
        )}
      </div>

      {/* 이메일 */}
      <div>
        <h4>이메일</h4>
        {editingField === "email" ? (
          <>
            <input type="text" value={values.email} onChange={handleChange} />
            <button onClick={() => setEditingField(null)}>확인</button>
          </>
        ) : (
          <>
            <p>{values.email}</p>
            <button onClick={() => setEditingField("email")}>수정</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryMain;
