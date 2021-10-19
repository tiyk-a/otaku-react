// import PermIdentityIcon from '@material-ui/icons/PermIdentity';
// import styled from '@material-ui/styles/styled';
// import React from 'react';
// import { Cookies } from 'react-cookie';
// import { UserAuth } from '../constants';
// /**
//  * ログイン処理のコンテナ
//  */
// const Login = () => {
//   // CookieからGitHubに登録しているユーザーネームを取得
//   const cookie = new Cookies();
//   const userToken = cookie.get('userToken');
//   // ユーザーサインアウトのURL
//   const signOutUrl = `${UserAuth.PATH}signout`;

//   // ログアウトの処理
//   const logoutFunc = () => {
//     window.alert('ログアウトしますよ');
//     // クッキーをクリアする
//     clearCookeis();
//     window.location.href = signOutUrl;
//   };

//   // ログインする
//   const loginFunc = () => {
//     window.alert('ログインしますよ');
//     window.location.assign(UserAuth.PATH);
//   };

//   // Cookieをクリアする
//   const clearCookeis = () => {
//     cookie.set('userToken', '');
//     cookie.set('userName', '');
//   };

//   return (
//     <div>
//       <User onClick={userToken ? logoutFunc : loginFunc} />
//     </div>
//   );
// };

// const User = styled(PermIdentityIcon)({
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '0 5px 0 20px',
//   cursor: 'pointer',
//   '&:hover': {
//     opacity: '0.5',
//     transition: 'opacity 0.5s',
//   },
// });

// export default Login;
