import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";


const MyInfo = () => {
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
        <div className="m-5">

      {/* 프로필 사진 */}
      <div  className="d-flex mb-5">
        <div className="mw-fit">
            <img
            src={values.profileImage}
            alt="배달부 사진"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <Button onClick={() => fileInputRef.current?.click()}
                size="sm" variant="light" 
                className="position-relative z-2 mw-fit"
                style={{ left:"-30px",top:"30px" }}
            >
                <FontAwesomeIcon icon={faCamera} />
            </Button>
            <Form.Control
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
            />
        </div>

        {/* 이름 */}
        <div className="d-flex mt-3 h-50 align-items-center">
            {editingField === "name" ? (
            <>
                <Form.Control type="text" value={values.name} onChange={handleChange} 
                className=""/>
                <Button onClick={() => setEditingField(null)}
                    size="sm" variant="light" 
                    className="w-25">확인</Button>
            </>
            ) : (
            <>
                <h3>{values.name}</h3>
                <Button onClick={() => setEditingField("name")}
                    size="sm" variant="light" className="m-2">수정</Button>
            </>
            )}
            <div className="position-absolute" style={{top:"260px"}}>@이메일</div>
        </div>
            

      </div>

      <hr/>
      
      {/* 계좌번호 */}
      <div className="d-flex align-items-center gap-2" style={{height:"50px"}}>
        <h4>계좌번호</h4>
        {editingField === "account" ? (
          <>
            <Form.Control type="text" value={values.account} onChange={handleChange}
                className="w-25 m-2" />
            <Button onClick={() => setEditingField(null)}
                size="sm" variant="light">확인</Button>
          </>
        ) : (
          <>
            <p>{values.account}</p>
            <Button onClick={() => setEditingField("account")}
                size="sm" variant="light" className="m-2">수정</Button>
          </>
        )}
      </div>

      {/* 전화번호 */}
      <div className="d-flex align-items-center gap-2" style={{height:"50px"}}>
        <h4>전화번호</h4>
        {editingField === "phone" ? (
          <>
            <Form.Control type="text" value={values.phone} onChange={handleChange}
                className="w-25 m-2"
            />
            <Button onClick={() => setEditingField(null)}
                size="sm" variant="light">확인</Button>
          </>
        ) : (
          <>
            <p>{values.phone}</p>
            <Button onClick={() => setEditingField("phone")}
                size="sm" variant="light" className="m-2">수정</Button>
          </>
        )}
      </div>

      {/* 이메일 */}
      <div className="d-flex align-items-center gap-2" style={{height:"50px"}}>
        <h4>이메일</h4>
        {editingField === "email" ? (
          <>
            <Form.Control type="text" value={values.email} onChange={handleChange}
                className="w-25 m-2" />
            <Button onClick={() => setEditingField(null)}
                size="sm" variant="light">확인</Button>
          </>
        ) : (
          <>
            <p>{values.email}</p>
            <Button onClick={() => setEditingField("email")}
                size="sm" variant="light" className="m-2">수정</Button>
          </>
        )}
      </div>
    </div>
    );
}

export default MyInfo;