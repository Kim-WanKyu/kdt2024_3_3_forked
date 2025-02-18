import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { findMember, MemberResponseData, MemberUpdateData, updateMember } from "../api/save-member";
import { updateProfile } from "firebase/auth";


const MyInfo = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const [user, setUser] = useState(auth.currentUser);
    const [userData, setUserData] = useState<MemberResponseData | null>();
    const [inputData, setInputData] = useState<MemberUpdateData>({
      uid: "",
      account: "",
      bank: "",
      name: "",
      phone: ""
    });
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
      if(!user) {
        // 추후 내 정보 페이지가 아닌 상위 페이지에서 로그인 확인하도록 변경 필요.
        console.log("로그인 안됨. 로그인 페이지로");
        navigate("/login");
      }
    }, [navigate, user]);
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setUser(user);
        if (user) {
          setUserData(await findMember(user?.uid));
        } else {
          setUserData(null);
          console.log(`uid null`);
        }
      });
      return () => unsubscribe();
    }, []);
    useEffect(() => {
      if (userData) {
        setInputData({
          account: userData.account,
          bank: userData.bank,
          name:userData.name,
          phone:userData.phone,
          uid:userData.memberId
        });
        setValues({
          name: userData.name,
          bank: userData.bank,
          account: userData.account,
          phone: userData.phone,
          email: userData.email,
          profileImage: user?.photoURL ?? "https://media.vlpt.us/images/holim0/post/7d80e99d-11bc-4327-b16d-324a8daa0014/image.png"
        })
      }
    }, [userData]);
    useEffect(() => {
    }, [inputData]);
    ////////////////////////////////////////////////


    // 수정 중인 필드 상태
    const [editingField, setEditingField] = useState<string | null>(null);
    const [values, setValues] = useState({
      name: "", // user?.displayName ?? "Anonymous",
      bank: "",
      account: "",
      phone: "",
      email: "",
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
            <Button onClick={() => {
              fileInputRef.current?.click();
            }}
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
            <Button onClick={async () => {
              if (values.name !== inputData.name) {
                setInputData((prevValues) => ({...prevValues , name: values.name}));
              }
              setEditingField(null);
            }}
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
          <div className="position-absolute" style={{top:"260px"}}>{values.email}</div>
        </div>
      </div>

      <hr/>
      
      {/* 계좌번호 */}
      <div className="d-flex align-items-center gap-2" style={{height:"50px"}}>
        <h4>계좌번호</h4>
        {editingField === "bank" ? (
          <>
            <select onChange={(e) => {
              setValues({ ...values, [editingField!]: e.currentTarget.value });
            }} value={values.bank}>
              <option value="">은행</option>
              <option value="신한">신한</option>
              <option value="우리">우리</option>
              <option value="국민">국민</option>
            </select>
            <Button onClick={() => {
              if (values.bank !== "" &&  values.bank !== inputData.bank) {
                setInputData((prevValues) => ({...prevValues , bank: values.bank}));
              }
              setEditingField(null)
            }}
              size="sm" variant="light">확인</Button>
          </>
          ) : (
          <>
            <p>{inputData.bank}</p>
            <Button onClick={() => {setEditingField("bank")}}
              size="sm" variant="light" className="m-2">수정</Button>
          </>
        )}
        {editingField === "account" ? (
          <>
            <Form.Control type="text" value={values.account} onChange={handleChange}
              className="w-25 m-2"
              required
              pattern="^[0-9]+$"
            />

            <Button onClick={() => {
              if (values.account !== inputData.account) {
                setInputData((prevValues) => ({...prevValues , account: values.account}));
              }
              setEditingField(null)
            }}
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
            <Button onClick={() => {
              if (values.phone !== inputData.phone) {
                setInputData((prevValues) => ({...prevValues , phone: values.phone}));
              }
              setEditingField(null)
            }}
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

      {/* 버튼 */}
      {!isLoading ? 
        <Button onClick={async () => {
          if (isLoading) {
            return;
          }
          if (editingField){
            alert(`수정 중인 내용이 있습니다.`);
            return;
          } else {
            setLoading(true);
            if (inputData.name === userData?.name && inputData.phone === userData?.phone
               && inputData.bank === userData.bank && inputData.account === userData?.account) {
              alert(`변경된 내용이 없습니다.`);
            } else {
              if (user) {
                await updateProfile(user, { displayName: inputData.name });
              }
              setUserData(await updateMember(inputData.uid, inputData.name, inputData.phone, inputData.bank, inputData.account));
            }
            setLoading(false);
          }
          
        }} size="lg" variant="light" className="m-2"> 내 정보 변경</Button>
        :
        <Button type="button">Loading...</Button>
      }
    </div>
    );
}

export default MyInfo;