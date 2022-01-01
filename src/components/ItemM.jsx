import { Box } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import TeamIdToName from '../functions/TeamIdToName';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const ItemM = ({ item, teamId }) => {
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY-MM-DD');
  const [id, setId] = useState('');
  const [intoId, setIntoId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [tmpVer, setTmpVer] = useState('');

  useEffect(() => {
    setTitle(item.title);

    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    setVerArrFunc(item.ver);

    setId(item.id);
    setImage(item.image);
  }, [item.id]);

  const setVerArrFunc = (ver) => {
    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    const outerArray = [];
    ver.forEach(ver => {
      const innerArray = [];
      innerArray.push(ver.im_v_id, ver.ver_name, ver.im_id);
      outerArray.push(innerArray);
    });
    setVerArr(outerArray);
  }

  const upBlog = async (item) => {
    if (teamId !== undefined) {
      await axios
        .get(ApiPath.IM + 'blog?imId=' + id + '&team=' + teamId, item)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.IM + id)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {});
    }
  };

  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
  };

  const handleChangeImage = e => {
    const txt = e.target.value;
    setImage(txt);
  };

  const handleVerArr = e => {
    const txt = e.target.value;
    var verId = e.target.parentNode.getAttribute('data');

    if (verId === null || verId === undefined) {
        // IDがないということは新規追加
        setTmpVer(txt);
    } else {
        // IDあるので更新
        // 1. Make a shallow copy of the items
        let vers = [...verArr];
        // 2. Make a shallow copy of the item you want to mutate
        let ver = {...vers[verId]};
        // 3. Replace the property you're intested in
        ver[1] = txt;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        vers[verId] = [ver[0], ver[1], ver[2]];
        // 5. Set the state to our new copy
        setVerArr(vers);
    }
  };

  const addVerArr = e => {
    if (e.keyCode === 13) {
      const tmpArr = [null, tmpVer, id];
      setVerArr([...verArr, tmpArr]);
      setTmpVer("");
    }
  }

  const updIM = async () => {
    const data = {
    im_id: id,
    title: title,
    wp_id: item.wpId,
    publication_date: date,
    amazon_image: image,
    del_flg: false,
    vers: verArr,
    }
    await axios
    .post(ApiPath.IM + id, data)
    .then(response => {
        window.location.reload();
    })
    .catch(error => {});
  };

  const postedStyle = {
    // background: "",
  };

  const notPostedStyle = {
    background: "pink",
  };

  return (
    <div className="itemContainer" className={item.wpId !== null && item.wpId !== undefined ? "postedStyle": "notPostedStyle"}>
      <Text>
        <ul>
          <li>
            {item.relList !== null && item.relList !== undefined ? (
              item.relList.map((e, index) => (
                  <TeamIdToName teamId={e} />
                ))
            ) : (
              <></>
            )}
            <br />
            {date}
          </li>
          <li>
            IMId: {item.id}
            <br />
            WpId: {item.wpId !== null && item.wpId !== undefined ? (item.wpId) : ("No Wp")}
          </li>
          <li className="textBoxTitle">
            <Input
              type="text"
              name="IM register"
              value={title}
              onChange={handleChangeTitle}
              placeholder="imId"
              className="titleInput"
            />
            <Btn onClick={updIM}>IM更新</Btn>
            <TextField
              required
              name="amazon image"
              label="amazon image"
              value={image}
              onChange={handleChangeImage}
              fullWidth={true}
              multiline={true}
              rows={3}
              rowsMax={5}
            />
          </li>
          <li className="textBox">
            <p>中括弧（「[」と「]」）は使用しないでください</p>
            <Input
              type="text"
              row="5"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="ver"
              className="titleInput"
              onKeyDown={addVerArr}
            />
            {verArr.length > 0 ? (
              verArr.map((e, index) => (
                <div className="itemBox" key={index}>
                  <Input
                    type="text"
                    name="ver"
                    value={e[1]}
                    data={index}
                    onChange={handleVerArr}
                    placeholder="ver"
                    className="titleInput"
                  />
                </div>
              ))
            ):("")
            }
            <p>{item.url}</p>
          </li>
          <li className="price">
            <p>
              <b>{item.price}</b>&nbsp;yen
            </p>
          </li>
          <li>
            <Btn onClick={delIm}>DELETE</Btn>
          </li>
          <li><Btn onClick={upBlog}>Blog更新</Btn></li>
        </ul>
      </Text>
    </div>
  );
};

/**
 * UI(文章系をまとめるBOX)
 *
 */
const Text = styled(Box)({
  padding: '10px',
});

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'black',
});

export default ItemM;
