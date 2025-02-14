import React, { FC, JSX, useState } from "react";
import { useParams } from "react-router-dom"; // URL에서 ID를 가져오기 위해 추가

const AdminInquiry: FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>(); // URL에서 ID 값 추출

  const [comment, setComment] = useState<{
    writer: string;
    date: string;
    text: string;
  }>({
    writer: "",
    date: "",
    text: "",
  });

  const [comments, setComments] = useState<
    { writer: string; date: string; text: string }[]
  >([]);

  const handleAddComment = () => {
    if (!comment.text.trim()) return; // 빈 댓글 방지

    setComments([...comments, comment]); // 댓글 추가
    setComment({ writer: "", date: "", text: "" }); // 입력 필드 초기화
  };

  const deleteArticle = () => {
    // 당장은 데이터베이스가 완성될 때까지 대기
  };

  return (
    <div>
      <div>
        <div>날짜</div>
        <div>제목 '{id}'</div>
        <button onClick={deleteArticle}>삭제</button>
      </div>
      <div>내용내용내용</div>
      <div>
        <h3>댓글</h3>
        <div>
          {comments.map((cmt, index) => (
            <div key={index}>
              <strong>{cmt.writer}:</strong> {cmt.text} ({cmt.date})
            </div>
          ))}
        </div>
        <input
          type="text"
          value={comment.writer}
          onChange={(e) => setComment({ ...comment, writer: e.target.value })}
          placeholder="작성자 이름"
        />
        <input
          type="date"
          value={comment.date}
          onChange={(e) => setComment({ ...comment, date: e.target.value })}
        />
        <input
          type="text"
          value={comment.text}
          onChange={(e) => setComment({ ...comment, text: e.target.value })}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment}>작성</button>
      </div>
    </div>
  );
};

export default AdminInquiry;
