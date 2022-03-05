import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * エラー画面描画のコンポーネント
 *
 */
const Error = () => {
  const location = useLocation();

  return (
    <div className="flexColumn">
      <h1>エラーです</h1>
      {location.state && location.state.message ? (
        <div>
          <p>{location.state.message}</p>
        </div>
      ) : (<></>)}
    </div>
  );
};

export default Error;
