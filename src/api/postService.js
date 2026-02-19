import client from './client';

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
  const response = await client.get('/posts', { params: { page, size } });
  return response.data;
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
              rank: 1, //
              postId: 452,
              title: "첫 인턴십에서 배운 비즈니스 매너",
              author: { // 명세서 규격: 객체 분리
                userId: 105,
                loginId: "test0404",
                trustScore: 50,
                isAnonymous: false
              },
              stats: { // 명세서 규격: 통계 분리
                likeCount: 524,
                viewCount: 12500
              },
              tags: ["#취업"],
              createdAt: "2026-01-31T06:57:00",
              updatedAt: "2026-01-31T06:58:00"
            },
            {
              rank: 2,
              postId: 451,
              title: "익명으로 올리는 우리 팀 빌런 대처법",
              author: {
                userId: null,
                loginId: null,
                trustScore: 40,
                isAnonymous: true
              },
              stats: {
                likeCount: 389,
                viewCount: 12000
              },
              tags: ["#팀플/과제", "#성적"],
              createdAt: "2026-01-31T05:20:00"
            }
          ]
        });
      }, 500);
    });
  }
  const response = await client.get('/posts/trending');
  return response.data;
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
  const response = await client.get('/tags/trending');
  return response.data;
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
            useToken: true,
            title: "팀플 무임승차 대처",
            situation: "졸업 작품 프로젝트 중 팀원 한 명이 연락이 두절되고 맡은 파트를 전혀 하지 않는 상황이었습니다.",
            action: "감정적으로 화내기보다, 현재 진행 상황을 객관적으로 정리하여 단톡방에 공유하고 데드라인을 다시 명확히 지정했습니다.",
            retrospective: "명확한 규칙과 역할분담 설정이 초기에 얼마나 중요한지 깨달았습니다.",
            tags: ["#팀플/과제"],
            createdAt: "2026-01-29T21:30:00",
            updatedAt: "2026-01-29T21:30:00",
            viewCount: 150,
            likeCount: 45
          }
        });
      }, 500);
    });
  }
  const response = await client.get(`/posts/${postId}`);
  return response.data;
};

/**
 * 5. 게시글 작성 (POST /posts)
 */
export const createPost = async (postData) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("🛠️ 서버로 보낼 데이터:", postData);
        resolve({ status: 200, message: "글 작성 성공" });
      }, 1000);
    });
  }
  const response = await client.post('/posts', postData);
  return response.data;
};

/**
 * 6. 게시글 검색 (일반) (/posts/search)
 */
export const searchPosts = async (searchParams) => {
  const { tags = [], page = 0, size = 20, sort = 'latest' } = searchParams;

  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          // 🚀 명세서 규격: items 배열과 페이징 정보 포함
          items: [
            {
              postId: 101,
              title: "팀플 갈등 해결",
              preview: "역할분담이 애매해서 어떻게 대처했냐면요...", //
              viewCount: 123,
              helpfulCount: 9, // 'likeCount'가 아닌 'helpfulCount' 사용
              createdAt: "2026-01-29T12:00:00Z"
            },
            {
              postId: 102,
              title: "인턴십 면접 꿀팁",
              preview: "비즈니스 매너가 정말 중요하더라고요.",
              viewCount: 85,
              helpfulCount: 15,
              createdAt: "2026-02-01T09:00:00Z"
            }
          ],
          page: 0,
          size: 20,
          totalElements: 132,
          totalPages: 7
        });
      }, 500);
    });
  }

  // 🚀 실제 서버 연결 시: tags=1&tags=4 형태를 위해 paramsSerializer 설정 권장
  const response = await client.get('/posts/search', { 
    params: { tags, page, size, sort } 
  });
  return response.data;
};

/**
 * 7. 게시글 좋아요 토글 (POST /posts/{postId}/like)
 */
export const toggleLikePost = async (postId) => {
  if (IS_TEST_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용: 호출할 때마다 상태가 반전된다고 가정
        // 🚀 현재 상태의 반대를 반환하도록 수정
        const newStatus = !currentStatus;
        resolve({
          status: 200,
          liked: newStatus,
          totalLikes: newStatus ? 21 : 20  // 좋아하면 21, 취소하면 20
        });
      }, 300);
    });
  }

  // 🚀 명세서 규격: Path에 postId 포함, Authorization은 client.js의 interceptor가 처리
  const response = await client.post(`/posts/${postId}/like`);
  return response.data; // { liked, totalLikes } 반환
};