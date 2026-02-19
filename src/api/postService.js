import client from './client'; // 🚀 우리가 만든 axios 인스턴스 사용

const IS_TEST_MODE = true; 

// 1. 전체 글 목록 조회 (/posts)
export const getAllPosts = async (page = 0, size = 3) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            content: [
              { postId: 101, title: "첫 번째 과거의 선택", author: { loginId: "user1", trustScore: 50, isAnonymous: false }, stats: { likeCount: 12, viewCount: 45 }, tags: ["#취업"], createdAt: "2026-02-18T09:00:00" },
              { postId: 102, title: "익명 고민 상담", author: { isAnonymous: true, trustScore: 30 }, stats: { likeCount: 5, viewCount: 120 }, tags: ["#연애"], createdAt: "2026-02-18T08:30:00" },
            ]
          }
        });
      }, 500);
    });
  }

  try {
    const response = await client.get('/posts', { params: { page, size } });
    return response.data;
  } catch (error) {
    console.error("전체 글 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 2. 인기글 TOP 10 조회 (/posts/trending)
export const getTrendingPosts = async () => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          message: "인기 게시글 조회 성공",
          data: [
            {
              rank: 1,
              postId: 452,
              title: "첫 인턴십에서 배운 비즈니스 매너",
              author: { userId: 105, loginId: "test0404", trustScore: 50, isAnonymous: false },
              stats: { likeCount: 524, viewCount: 12500 },
              tags: ["#취업"],
              createdAt: "2026-01-31T06:57:00"
            }
          ]
        });
      }, 500);
    });
  }

  try {
    const response = await client.get('/posts/trending');
    return response.data;
  } catch (error) {
    console.error("인기글 조회 실패:", error.response?.data || error.message);
    return { status: 500, message: "인기글 로드 오류" };
  }
};

// 3. 인기 태그 조회 (/tags/trending)
export const getTrendingTags = async () => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: ["군대", "휴학", "성적", "장학금", "졸업"] });
      }, 300);
    });
  }

  try {
    const response = await client.get('/tags/trending');
    return response.data;
  } catch (error) {
    console.error("인기 태그 조회 실패:", error.message);
    return { status: 500, data: [] };
  }
};

/**
 * 4. 게시글 상세 조회 (/posts/{postId})
 */
export const getPostDetail = async (postId) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            postId: postId,
            isAnonymous: true,
            title: "팀플 무임승차 대처",
            situation: "졸업 작품 프로젝트 중 팀원 한 명이 연락이 두절되었습니다.",
            action: "데드라인을 다시 명확히 지정했습니다.",
            retrospective: "초기 역할분담의 중요성을 깨달았습니다.",
            tags: ["#팀플/과제"],
            createdAt: "2026-01-29T21:30:00",
            updatedAt: "2026-01-29T21:40:00", // 수정됨 표시 테스트용
            viewCount: 150,
            likeCount: 45,
            liked: false //좋아요 여부 추가
          }
        });
      }, 500);
    });
  }

  try {
    const response = await client.get(`/posts/${postId}`);
    return response;
  } catch (error) {
    console.error("글 상세 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 5. 게시글 작성 (POST /posts)
 */
export const createPost = async (postData) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🛠️ 시뮬레이션 데이터:", postData);
        resolve({ status: 200, message: "글 작성 성공" });
      }, 1000);
    });
  }

  try {
    const response = await client.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error("글 작성 실패:", error.response?.data || error.message);
    // 💡 토큰 부족(402) 등 명세서의 특수 에러 대응
    return error.response?.data || { status: 400, message: "작성 실패" };
  }
};

/**
 * 6. 게시글 검색 (/posts/search)
 */
export const searchPosts = async (searchParams) => {
  const { tags = [], page = 0, size = 20, sort = 'latest' } = searchParams;

  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          items: [
            { postId: 101, title: "검색 결과 테스트", viewCount: 123, helpfulCount: 9, createdAt: "2026-01-29T12:00:00Z" }
          ],
          pageInfo: { currentPage: page, hasNext: false, totalElements: 1 }
        });
      }, 500);
    });
  }

  try {
    const response = await client.get('/posts/search', { params: { tags, page, size, sort } });
    return response.data;
  } catch (error) {
    console.error("검색 실패:", error.message);
    return { status: 500, items: [] };
  }
};

/**
 * 7. 게시글 좋아요 토글
 */
export const toggleLikePost = async (postId, currentLikedStatus) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStatus = !currentLikedStatus; // 현재 상태 반전
        resolve({
          status: 200,
          liked: newStatus,
          totalLikes: newStatus ? 21 : 20
        });
      }, 300);
    });
  }

  try {
    const response = await client.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("좋아요 처리 실패:", error.message);
    throw error;
  }
};