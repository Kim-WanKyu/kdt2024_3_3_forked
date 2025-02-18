import { useState } from "react";

import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createMember } from "../api/save-member";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { CustomHTTPError } from "../api/skel";
import "./Register.css";
import '../main.scss';
import { useNavigate } from "react-router-dom";
// import FindAddr from "./FindAddr";

type FormData = {
  usertype: "";
  pw: "";
  pwcheck: "";
  name: "";
  email: "";
  phonenum: "";
  account: ""; // type [] => string 로 수정.
  accountnum: "";
  address: IAddrPost;
};

const Regex = {
  id: /^[a-zA-Z0-9-_]{4,}$/,
  pw: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
};

declare global {
  interface Window {
    daum?: any;
  }
}

// 
export interface IAddrPost {
  roadAddress: string;    // 도로명주소.
  zonecode: string;       // 우편번호.
  detailAddress: string;  // 세부주소.
  bcode: string;          // 법정동코드.
}

export interface IAddrResponse {
  roadAddress: string;    // 도로명주소.
  detailAddress: string;  // 세부주소.
  bcode: string;          // 법정동코드.
}


const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ mode: "onChange" });

  const [myerror, setMyerror] = useState(""); // 에러 메시지.
  const [mytest, setMytest] = useState(""); // 테스트용.
  const [isLoading, setLoading] = useState(false); // 로딩 중인지 여부.
  const navigate = useNavigate();

  // 비밀번호와 비밀번호 확인이 일치하는지 검증
  const pwRef = useRef<string | null>(null);
  pwRef.current = watch("pw");

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    // data.address, userype 가 값이 전달되지 않아 강제로 초기화... .
    data.address = {
      "roadAddress": (document.getElementById("addr") as HTMLInputElement).value,
      "zonecode": (document.getElementById("zipNo") as HTMLInputElement).value,
      "detailAddress": (document.getElementById("addrDetail") as HTMLInputElement).value,
      "bcode": (document.getElementById("bcode") as HTMLInputElement).value
    };
    
    console.log(`2 address: ${JSON.stringify(data.address)}`);


    ///////// 회원가입 로직 실행...
    setMyerror("");
    setMytest("");

    let credentials: UserCredential | null = null;
    try {
      // 로딩이거나 빈 칸 있으면, 리턴.
      if (
        isLoading === true ||
        data.email === "" ||
        data.pw === "" ||
        data.pwcheck === "" ||
        data.name === "" ||
        data.phonenum === "" ||
        data.account === "" ||
        data.accountnum === "" ||
        data.usertype === "" ||
        data.address === null // ?.
      )
        return;
      // 비밀번호 확인 일치 안하면 리턴.
      if (data.pw !== data.pwcheck) return;

      setLoading(true);

      // 우선, 사용자의 이메일 주소와 비밀번호를 사용하여 파이어베이스에 새 계정을 생성.
      credentials = await createUserWithEmailAndPassword(auth, data.email, data.pw);
      // 성공하면 사용자는 자격 증명을 받게되고, 어플리케이션에 즉시 로그인 됨.
      // 계정이 이미 존재하거나 패스워드가 유효하지 않은 경우 사용자 계정 생성 실패.

      // 사용자의 프로필 업데이트. (이름)
      await updateProfile(credentials.user, {
        displayName: data.name,
      });
    } catch (e) {
      // 에러 발생 시.
      // setError.
      if (e instanceof FirebaseError) {
        setMyerror("firebase error: " + e.message);
      }

      console.log(`credentials:: ${credentials}`);
      if (credentials) {
        // 계정 생성을 했다면, 에러 발생했으므로 등록된 파이어베이스의 계정을 다시 삭제.
        await credentials.user.delete();
      }

      setLoading(false);
      return;
    }

    try {
        console.log(`!:: credentials.user: ${credentials.user}`);

        console.log(`data: ${JSON.stringify(data)}`);
        
        console.log(`address: ${data.address}`);

        console.log(`usertype: ${data.usertype}`);

      await alert('회원가입이 완료되었습니다.');
      await navigate('/login');
      

      // 위에서 에러가 안나면, 로그인된거고, 계정 등록이 성공했다는 소리이므로, 현재 uid 와 나머지 정보를 springboot 로 보내서 db에 저장.
      // credentials.user 에 uid, email(id), name 있음, + 나머지 정보 phone, bank, account, 주소(address), role 도 보내줌.
      await createMember(
        credentials.user.uid,
        data.email,
        data.name,
        data.phonenum,
        data.account,
        data.accountnum,
        data.address,
        "GENERAL" // data.usertype 이 없어서 GENERAL 로 . "GENERAL": 일반 회원 / "DELIVERY": 배달부.
      );



    } catch (e) {
      await auth.currentUser?.delete(); // 저장에 실패했으므로 등록된 파이어베이스의 계정을 다시 삭제.
      
      // setError.
      if (e instanceof CustomHTTPError) {
        setMyerror(`HTTP error: ${e.message} ${e.status}`);
      } else if (e instanceof Error) {
        setMyerror(`error: ${e.message}`);
      }

    } finally {
      setLoading(false);
      if (auth.currentUser) {
        setMytest(auth.currentUser.uid + ": " + auth.currentUser.displayName);
      }
      await auth.signOut(); // 회원가입 끝나면, 로그아웃 시키고,
      // navigate("/login"); // 로그인 페이지로 이동.
    }

    
  };

  // 우편번호로 주소 찾기
  const onClickAddr = () => {
      new window.daum.Postcode({
        oncomplete: function (data: IAddrPost) {
          (document.getElementById("addr") as HTMLInputElement).value =
            data.roadAddress;
          (document.getElementById("zipNo") as HTMLInputElement).value =
            data.zonecode;
          (document.getElementById("bcode") as HTMLInputElement).value =
            data.bcode;
          document.getElementById("addrDetail")?.focus();
        },
      }).open();
  };

  return (
    <>
      {/* <></> 는 테스트 용으로 추가... */}
      {/* 아이디칸 지우고 이메일칸을 위로 올림... */}
      <form onSubmit={handleSubmit(onSubmit)} className="form-wrap">
        <h3>회원가입</h3>
        <div className="register-form-input">
          <div className="register-form-radio-group">
            <label>회원 유형*</label>
            <label className="radio-label">
              <input 
                type="radio" name="usertype" value="GENERAL"
              />
              <span>일반회원으로 가입</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" name="usertype" value="DELIVERY"
              />
              <span>배달부로 가입</span>
            </label>
          </div>
          <div>
            <label>이메일*</label>
            <input
              {...register("email", {
                required: true,
                pattern: {
                  value: Regex.email,
                  message: "이메일 형식이 올바르지 않습니다.",
                },
              })}
              placeholder="aaa@aaaaa.aaa"
            />
            {errors.email && errors.email.type === "pattern" && (
              <span>{errors.email.message}</span>
            )}
          </div>

          <div>
            <label>비밀번호*</label>
            <input
              {...register("pw", {
                required: true,
                pattern: {
                  value: Regex.pw,
                  message: "비밀번호 형식이 올바르지 않습니다.",
                },
              })}
              placeholder="대소문자, 숫자, !@#$% 필수입력 8~24자"
            />
            {errors.pw && errors.pw.type === "pattern" && (
              <span>{errors.pw.message}</span>
            )}
          </div>
          <div>
            <label>비밀번호 확인*</label>
            <input
              {...register("pwcheck", {
                required: true,
                validate: (value) => value === pwRef.current,
              })}
              placeholder="대소문자, 숫자, !@#$% 필수입력 8~24자"
            />
            {errors.pwcheck && errors.pwcheck.type === "validate" && (
              <span>비밀번호 불일치</span>
            )}
          </div>
          <div>
            <label>이름*</label>
            <input
              {...register("name", {
                required: true,
              })}
            />
          </div>
          <div>
            <label>전화번호*</label>
            <input
              {...register("phonenum", {
                required: true,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "전화번호 형식이 올바르지 않습니다.",
                },
              })}
              placeholder="숫자만 입력"
            />
            {errors.phonenum && errors.phonenum.type === "pattern" && (
              <span>{errors.phonenum.message}</span>
            )}
          </div>
          <div className="form-account">
            <label>계좌번호*</label>
            <div>
              <select
                {...register("account", {
                  required: true,
                })}
              >
                <option value="">은행</option>
                <option value="신한">신한</option>
                <option value="우리">우리</option>
                <option value="국민">국민</option>
              </select>
              <input
                {...register("accountnum", {
                  required: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "계좌번호 형식이 올바르지 않습니다.",
                  },
                })}
                placeholder="숫자만 입력"
              />
            </div>
            {errors.accountnum && errors.accountnum.type === "pattern" && (
              <span>{errors.accountnum.message}</span>
            )}
          </div>
          <div className="form-addr">
            <label>주소</label>

            {/* <FindAddr /> */}

            <input
              id="zipNo"
              type="text"
              readOnly
              onClick={onClickAddr}
            />
            <button
              type="button"
              onClick={onClickAddr}>검색</button>
            <input
              id="addr"
              type="text"
              readOnly
            />
            {/* bcode(법정동코드) hidden으로 추가 */}
            <input id="bcode" type="text" readOnly hidden /> 
            <input
              id="addrDetail"
              type="text"
            />
          </div>
        </div>
        {isLoading ? (
          <input type="button" value="Loading..." />
        ) : (
          <input type="submit" value="회원가입 하기" />
        )}
      </form>
      {/* // /////////////////// 테스트 */}
      {/* <br />
      {"error: " + myerror}
      <br />
      {"test: " + mytest} */}
    </>
  );
};

export default Register;
