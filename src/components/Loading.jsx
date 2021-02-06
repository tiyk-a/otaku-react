import React from 'react';
import { LoadingImage } from '../components/Image';

/**
 * ローディング中に表示するコンポーネント
 *
 */
const Loading = () => {
  return (
    <div className="flexColumn">
      <h1 className="loadingMsg">L O A D I N G . . .</h1>
      <img className="spin" src={LoadingImage.path} alt="ローディング画像" />
    </div>
  );
};

export default Loading;
