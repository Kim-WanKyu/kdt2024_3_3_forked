import React, { useState } from 'react';

import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from '../firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { findMember } from '../api/save-member';
import { CustomHTTPError } from '../api/skel';
import "./Login.css";
import '../main.scss';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
    id: "",
    pw: "",
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormData>();
    
    const [myerror, setMyerror] = useState(""); // 에러 메시지.
    const [mytest, setMytest] = useState("");   // 테스트용.
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();


    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        console.log(data);

        ///////// 로그인 로직 실행...
        setMyerror("");
        setMytest("");
        
        let userCredential: UserCredential; 
        try {
            if (isLoading || data.id === "" || data.pw === "")  return;

            setLoading(true);

            // 로그인 처리.
            // firebase 로그인 성공 시 uid 저장.
            userCredential = await signInWithEmailAndPassword(auth, data.id, data.pw);

        } catch(e) {
            // setError.
            if(e instanceof FirebaseError) {
                setMyerror("firebase login error: " +  e.message);
            }

            setLoading(false);
            return;
        }
        
        try{
            // 스프링부트 통해 DB 에서 회원 정보 찾기.
            const foundUser = await findMember(userCredential.user.uid);
            // 응답.
            if (foundUser.memberId) {
                console.log(`3login uid: ${foundUser.memberId}`);
                console.log(`3login addresses: ${foundUser.memberAddresses[0]?.roadAddress}`);
                setMytest(JSON.stringify(foundUser));
            }
            
            // 로그인 성공 시 사용자를 홈페이지로 리다이렉트.
            navigate("/");

        } catch(e) {
            if (e instanceof CustomHTTPError) {
                await auth.signOut(); // DB 조회에 실패했으므로, 로그아웃.
                setMyerror("http error: get member error: " + e.status);
            } else {
                // setError.
                setMyerror("login other error: " + e);//.message);
            }
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <>
        {/* <></> 는 테스트 용으로 추가... */}

            <div>
            <form onSubmit={handleSubmit(onSubmit)} className="form-wrap">
                <h3>로그인</h3>

                <div className="login-form-input">
                    <div>
                        <label>이메일</label>
                        <input {...register("id", {
                            required: true,
                        })}/>
                    </div>
                    
                    <div>
                        <label>비밀번호</label>
                        <input {...register("pw", {
                            required: true,
                        })} type='password'
                        />
                        <img src="" />
                    </div>
                </div>
                
                {isLoading ? (
                    <input type="button" value="Loading..." />
                ) : (
                    <input type="submit" value="로그인 하기" />
                )}
                </form>
            </div>
            {/* // /////////////////// 테스트 */}
            {/* <br />
            {"error: " + myerror}
            <br />
            {"test: " + mytest}
            <br />
            {`current user: + ${auth.currentUser?.uid} : ${auth.currentUser?.email} : ${auth.currentUser?.displayName}`} */}
        </>
    );
}

export default Login;