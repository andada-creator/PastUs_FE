import client from './client'; // axios 인스턴스 (baseURL: http://192.168.219.168:8080 가정)


// 요청 인터셉터: 모든 요청에 토큰 자동 포함
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * [1] 게시글 기본 CRUD (PostController 연동)
 */

// [1] 게시글 목록 조회
export const getAllPosts = async (page = 0, size = 10) => {
  // .data를 붙이지 말고 response 객체 전체를 반환해야 main.js의 status 체크가 통과됩니다.
  return await client.get('/api/posts', { params: { page, size } });
};

// [2] 인기글 목록 조회
export const getTrendingPosts = async () => {
  // try-catch 내부에서도 response 객체 전체를 반환하세요.
  const response = await client.get('/api/posts/trending');
  return response; 
};

// 게시글 상세 조회
export const getPostDetail = async (postId) => {
  const response = await client.get(`/api/posts/${postId}`);
  return response.data; // PostResponse 반환
};

// 게시글 작성
export const createPost = async (postData) => {
  const response = await client.post('/api/posts', postData);
  return response.data; // 생성된 postId 반환
};

// 게시글 수정
export const updatePost = async (postId, updateData) => {
  const response = await client.put(`/api/posts/${postId}`, updateData);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (postId) => {
  const response = await client.delete(`/api/posts/${postId}`);
  return response.data;
};


/**
 * [2] 좋아요 및 조회수 (PostLike & PostView Controller 연동)
 */

// 좋아요 토글
export const toggleLikePost = async (postId) => {
  const response = await client.post(`/api/posts/${postId}/likes`);
  return response.data; // PostLikeToggleResponse (liked 여부, totalLikes 등)
};

// 조회수 기록 (쿠키 기반 중복 방지는 백엔드에서 처리됨)
export const recordPostView = async (postId) => {
  const response = await client.post(`/api/posts/${postId}/views`);
  return response.data; // PostViewCountResponse (viewCount 반환)
};


/**
 * [3] 태그 관리 (TagController 연동)
 * 주의: TagController는 @RequestMapping에 /api가 없으므로 경로 확인 필요
 */

// 1. 전체 상황 태그 목록 조회 (GET /tags/situations)
export const getSituationTags = async () => {
  const response = await client.get('/tags/situations');
  return response.data; // List<SituationTagResponse> 반환
};

// 2. 특정 게시글의 태그 조회 (GET /posts/{postId}/tags/situations)
export const getPostSituationTags = async (postId) => {
  const response = await client.get(`/posts/${postId}/tags/situations`);
  return response.data; // List<PostSituationTagResponse> 반환
};

// 3. 특정 게시글에 태그 저장/수정 (POST /posts/{postId}/tags/situations)
export const savePostSituationTags = async (postId, tagIds) => {
  // tagIds는 [1, 2, 3] 형태의 배열이어야 함
  const response = await client.post(`/posts/${postId}/tags/situations`, { tagIds });
  return response.data;
};

// 4. 인기 태그 조회 (GET /tags/trending)
export const getTrendingTags = async () => {
  return await client.get('/tags/trending');
};


/**
 * [4] 검색 기능
 * (PostController에 검색 메서드가 추가될 것을 대비한 규격)
 */
export const searchPosts = async ({ tags = [], page = 0, size = 20, sort = 'latest' }) => {
  const tagQuery = tags.map(id => `tags=${id}`).join('&');
  let url = `/api/posts/search?page=${page}&size=${size}&sort=${sort}`;
  if (tagQuery) url += `&${tagQuery}`;

  const response = await client.get(url);
  return response.data;
};