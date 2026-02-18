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
          data: [
            { postId: 201, title: "이번 주 1등 글입니다!", author: { loginId: "king", trustScore: 99, isAnonymous: false }, stats: { likeCount: 500, viewCount: 9999 }, tags: ["#꿀팁"], createdAt: "2026-02-17T12:00:00" }
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