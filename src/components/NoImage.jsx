import React from 'react';
import { NoImageLlama } from '../components/Image';

/**
 * 商品画像が登録されていない時に表示するコンポーネント
 *
 */
const NoImage = () => {
  return <img src={NoImageLlama.path} alt="商品画像未登録" />;
};

export default NoImage;
