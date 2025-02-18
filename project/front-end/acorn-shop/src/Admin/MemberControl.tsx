import React, { FC, useState, ChangeEvent, useEffect } from "react";
import "./css/BoardStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const MemberControl: FC = () => {
  const [members, setMembers] = useState<
    {
      isSelected: boolean;
      memberId: string; // memberId 추가
      name: string;
      ID: string;
      phone: string;
      isBlacklisted: boolean;
    }[]
  >([]);

  const [pages, setPages] = useState<number[]>([1]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [blacklistFilter, setBlacklistFilter] = useState<boolean>(false);

  const pageSize = 10; // 한 페이지에 표시할 멤버 수

  // 데이터 서버에서 가져오기
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/all_members`)
      .then((response) => response.json())
      .then((data) => {
        // data가 바로 배열이라면 content 없이 바로 map을 사용
        const fetchedMembers = (data || []).map((member: any) => ({
          isSelected: false,
          memberId: member.memberId,
          name: member.name,
          ID: member.email,
          phone: member.phone,
          isBlacklisted: member.blacked,
        }));

        setMembers(fetchedMembers);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      });
  }, [currentPage]); // currentPage가 변경될 때마다 데이터 가져오기

  // 멤버 삭제 함수
  const deleteMember = (memberId: string): void => {
    fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
      method: "DELETE",
    })
      .then(() => {
        const newMembers = members.filter(
          (member) => member.memberId !== memberId
        );
        setMembers(newMembers);
      })
      .catch((error) => {
        console.error("멤버 삭제 중 오류 발생:", error);
      });
  };

  // 선택된 멤버 삭제 함수
  const deleteSelectedMembers = (): void => {
    const selectedMemberIds = members
      .filter((member) => member.isSelected)
      .map((member) => member.memberId);

    if (selectedMemberIds.length === 0) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/member`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedMemberIds }),
    })
      .then(() => {
        const newMembers = members.filter((member) => !member.isSelected);
        setMembers(newMembers);
      })
      .catch((error) => {
        console.error("선택된 멤버 삭제 중 오류 발생:", error);
      });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    setCurrentPage(1); // 검색 시 첫 페이지로 돌아가기

    const searchParams = new URLSearchParams();
    if (keyword) {
      searchParams.append("name", keyword);
      searchParams.append("phone", keyword);
    }

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/all_members?${searchParams.toString()}&page=${currentPage}&size=${pageSize}`
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedMembers = data.content.map((member: any) => ({
          isSelected: false,
          memberId: member.memberId,
          name: member.name,
          ID: member.email,
          phone: member.phone,
          isBlacklisted: member.blacked,
        }));
        setMembers(fetchedMembers);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      });
  };

  const toggleBlacklistFilter = (): void => {
    setBlacklistFilter((prev) => !prev);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 돌아가기
  };

  const toggleMemberSelected = (memberId: string): void => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.memberId === memberId
          ? { ...member, isSelected: !member.isSelected }
          : member
      )
    );
  };

  const toggleMemberBlacklist = (memberId: string): void => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.memberId === memberId
          ? { ...member, isBlacklisted: !member.isBlacklisted }
          : member
      )
    );

    const newBlacklistedStatus = !members.find(
      (member) => member.memberId === memberId
    )?.isBlacklisted
      ? "t"
      : "f";

    fetch(
      `${process.env.REACT_APP_API_URL}/api/member/${memberId}/black?value=${newBlacklistedStatus}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          value: newBlacklistedStatus,
        }),
      }
    )
      .then(() => {
        console.log("블랙리스트 상태 업데이트 성공");
      })
      .catch((error) => {
        console.error("블랙리스트 상태 업데이트 중 오류 발생:", error);
      });
  };

  // 전체 페이지에 있는 모든 멤버를 선택
  const selectAllMembersOnPage = (): void => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        displayedMembers.some((mem) => mem.memberId === member.memberId)
          ? { ...member, isSelected: true }
          : member
      )
    );
  };

  // 전체 페이지에 있는 모든 멤버의 선택 해제
  const deselectAllMembersOnPage = (): void => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        displayedMembers.some((mem) => mem.memberId === member.memberId)
          ? { ...member, isSelected: false }
          : member
      )
    );
  };

  const filteredMembers = members.filter((member) => {
    const matchesKeyword =
      member.name.includes(searchKeyword) || member.ID.includes(searchKeyword);
    const matchesBlacklist = !blacklistFilter || member.isBlacklisted;
    return matchesKeyword && matchesBlacklist;
  });

  const displayedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const displayedPages = Array.from(
    { length: Math.min(10, totalPages - startPage + 1) },
    (_, i) => i + startPage
  );

  return (
    <div>
      <h3 style={{ marginLeft: "30px" }}>회원 관리</h3>
      <div style={{ maxWidth: "calc(100% - 100px)", margin: "0 auto" }}>
        <div className="div1">
          <div className="div1-left">
            <input
              type="text"
              placeholder="검색"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="div1-item1"
            />
            <label>
              <input
                type="checkbox"
                checked={blacklistFilter}
                onChange={toggleBlacklistFilter}
                className="custom-checkbox"
              />
              블랙리스트
            </label>
          </div>

          <button className="div1-item3" onClick={deleteSelectedMembers}>
            선택 삭제
          </button>
        </div>

        <div className="div2">
          <div className="div-check">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  selectAllMembersOnPage();
                } else {
                  deselectAllMembersOnPage();
                }
              }}
              style={{ marginLeft: "5px" }}
              className="custom-checkbox"
            />
          </div>
          <p className="column-id">ID</p>
          <p className="column-name">이름</p>
          <p className="column-phone">전화번호</p>
          <p className="column-blacklist">블랙리스트</p>
        </div>
        <div className="div-item">
          {displayedMembers.map((member) => (
            <div className="div-items" key={member.memberId}>
              <div className="div-check">
                <input
                  type="checkbox"
                  checked={member.isSelected}
                  className="custom-checkbox"
                  onChange={() => toggleMemberSelected(member.memberId)}
                />
              </div>
              <span>{member.ID}</span>
              <span>{member.name}</span>
              <span>{member.phone}</span>
              <div>
                <input
                  type="checkbox"
                  checked={member.isBlacklisted}
                  className="custom-checkbox"
                  onChange={() => toggleMemberBlacklist(member.memberId)}
                  style={{ marginLeft: "190px", marginRight: "70px" }}
                />
              </div>
              <div
                onClick={() => deleteMember(member.memberId)}
                className="delete-button"
                style={{ marginRight: "30px" }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          ))}
        </div>

        <div className="div3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            &lt;
          </button>
          {displayedPages.map((page) => (
            <div
              key={page}
              style={{
                cursor: "pointer",
                fontWeight: page === currentPage ? "bold" : "normal",
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </div>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberControl;
