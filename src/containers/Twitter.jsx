import React from 'react';
import TweetEmbed from 'react-tweet-embed';

/**
 * Twitterページのコンテナ
 *
 */
const Twitter = () => {

  return (
    <div className='row wrap'>
      <TweetEmbed id="" options={{theme: 'dark' }} />
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        <a className="twitter-timeline" data-height="1000" data-width="300" href="https://twitter.com/idol_hayainfo?ref_src=twsrc%5Etfw">idol_hayainfo</a>
        <a className="twitter-timeline" data-height="1000" data-width="300" data-theme="dark" href="https://twitter.com/sixtoneshayain1?ref_src=twsrc%5Etfw">idol_hayainfo</a>
        <a className="twitter-timeline" data-height="1000" data-width="300" href="https://twitter.com/snowmanhayainfo?ref_src=twsrc%5Etfw">snowmanhayainfo</a>
        <a className="twitter-timeline" data-height="1000" data-width="300" data-theme="dark" href="https://twitter.com/sexyz0neinfo?ref_src=twsrc%5Etfw">sexyz0neinfo</a>
        <a className="twitter-timeline" data-height="1000" data-width="300" href="https://twitter.com/naniwa_hayainfo?ref_src=twsrc%5Etfw">sexyz0neinfo</a>
        <a className="twitter-timeline" data-height="1000" data-width="300" data-theme="dark" href="https://twitter.com/princehayainfo?ref_src=twsrc%5Etfw">princehayainfo</a>
        <a className="twitter-timeline" data-width="300" data-height="1000" href="https://twitter.com/kinki_hayainfo?ref_src=twsrc%5Etfw">kinki_hayainfo</a>
        <a className="twitter-timeline" data-width="300" data-height="1000" data-theme="dark" href="https://twitter.com/jump_hayainfo?ref_src=twsrc%5Etfw">jump_hayainfo</a>
        <a className="twitter-timeline" data-width="300" data-height="1000" data-theme="light" href="https://twitter.com/kanjaninfo?ref_src=twsrc%5Etfw">kanjaninfo</a>
    </div>
  );
};

export default Twitter;
