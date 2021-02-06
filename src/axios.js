import Axios from 'axios';
import { Cookies } from 'react-cookie';
import history from './history';

/**
 * axios設定
 *
 */

const cookies = new Cookies();
const userToken = cookies.get('userToken');

const axios = Axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${userToken}`,
    'Content-Type': 'application/json; charset=utf-8',
  },
});

/** axios interceptor */
axios.interceptors.response.use(
  function(response) {
    // リクエスト前はまだ特に設定なし
    return response;
  },
  function(error) {
    console.error(error);
    // 共通エラーハンドリング
    let statusCode = undefined;
    let message = '';

    if (error.message === 'Network Error') {
      statusCode = '500';
      message = 'APIの起動を確認してください!';
    }
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.status
    ) {
      statusCode = error.response.data.error.status;
      error.response.data.error.message
        ? (message = error.response.data.error.message)
        : (message = 'エラーが発生しました');
    } else {
      if (statusCode === undefined || message === '') {
        statusCode = '500';
        message = 'エラーが発生してしまいました。。。';
      }
    }
    // エラー画面に遷移
    history.push({
      pathname: '/error/',
      state: {
        status: statusCode,
        message: message,
      },
    });
  }
);

export default axios;
