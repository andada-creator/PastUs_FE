import client from './client';

// 🚀 테스트 모드 플래그 (서버 연결 시 false로 변경)
const IS_TEST_MODE = false; 

/**
 * 아카이브 목록 조회 API
 * @param {string} filter - MY_POST(내가 쓴 글) / LIKED(좋아요한 글)
 * @param {string} sort - latest(최신순), views(조회수순), likes(좋아요순)
 */
export const getArchivePosts = async (filter = 'MY_POST', sort = 'latest', page = 0) => {
  if (IS_TEST_MODE) {
    // 💡 실제 API 응답 구조와 똑같은 Mock Data
    return {
      status: 200,
      message: "조회 성공하였습니다.",
      data: {
        content: filter === 'MY_POST' ? [
          {
            postId: 101,
            title: "무임승차 팀원 대처법",
            userName: "익명",
            trustScore: 50,
            viewCount: 120,
            likeCount: 35,
            createdAt: "2026-01-31T06:26:00",
            hashtags: ["#리더십", "#협업", "#조별과제"]
          },
          {
            postId: 102,
            title: "시험 기간 멘탈 관리 팁",
            userName: "익명",
            trustScore: 45,
            viewCount: 85,
            likeCount: 12,
            createdAt: "2026-01-30T10:00:00",
            hashtags: ["#학업", "#멘탈관리"]
          }
        ] : [
          // 🚀 '타인의 과거' (좋아요한 글) 데이터
          {
            postId: 201,
            title: "전공 서적 싸게 사는 법 공유",
            userName: "익명",
            trustScore: 70,
            viewCount: 340,
            likeCount: 150,
            createdAt: "2026-01-28T15:20:00",
            hashtags: ["#정보공유", "#대학생활"]
          }
        ],
        pageInfo: {
          currentPage: page,
          hasNext: false,
          totalElements: filter === 'MY_POST' ? 2 : 1
        }
      }
    };
  }

  // 🚀 실제 서버 통신 로직
  try {
    const response = await client.get('/users/me/posts', {
      params: { 
        filter, // MY_POST or LIKED
        sort,   // latest, views, likes
        page, 
        size: 20 
      }
    });
    console.log("아카이브 서버 응답:",response.data);
    // 성공 시 데이터 반환
    return response.data; 

  } catch (error) {
    // 🚀 전공자 팁: 네트워크 에러, 400/500 에러 등을 여기서 잡아줍니다.
    console.error("아카이브 목록 조회 실패:", error.response?.data || error.message);
    
    // 에러를 UI 쪽으로 던져서 Alert 등을 띄울 수 있게 합니다.
    throw error; 
  }
};

// 🚀 아카이브 목록 조회 API
/*export const getArchivePosts = async (filter = 'MY_POST', sort = 'latest', page = 0) => {
  try {
    const response = await client.get('/users/me/posts', {
      params: { filter, sort, page, size: 20 } // 명세서 규격 반영
    });
    return response.data;
  } catch (error) {
    console.error("아카이브 조회 실패:", error);
    throw error;
  }
};*/