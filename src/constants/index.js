/**
 * API関連定数
 */
export const ApiPath = {
  ITEMS: '/api/items',
  SEARCH_ITEM: '/api/items/search',
  ITEM: '/api/items/$id',
  ITEM_IMAGE: '/api/items/$id/image',
  IMAGE: '/images/',
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT, // 画像取得で利用
};

/**
 * ユーザー認証関連の定数
 */
export const UserAuth = {
  PATH: process.env.REACT_APP_AUTH_ENDPOINT,
};
