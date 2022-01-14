import { Box } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import exportFunction from '../functions/TeamIdToName';
import axios from '../axios';
import { ApiPath } from '../constants';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
  const [editedFlg, setEditedFlg] = useState(false);
  const [imrel, setIMrel] = useState([]);
  const [imrelM, setIMrelM] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memberIdList, setMemberIdList] = useState([]);
  const [addIMrelFlg, setAddIMrelFlg] = useState(false);
  const [addIMrelMFlg, setAddIMrelMFlg] = useState(false);

  useEffect(() => {
    // teamList
    const outerArr = [];
    if (item.relList !== null && item.relList !== undefined && item.relList.length > 0) {
      item.relList.forEach((e) => {
        const innerArr = [];
        innerArr.push(e.im_rel_id, e.im_id, e.team_id);
        outerArr.push(innerArr);
      });
      setIMrel(outerArr);
    } else {
      setIMrel([]);
    }

    // MemList
    const outerArrM = [];
    if (item.memList !== null && item.memList !== undefined && item.memList.length > 0) {
      item.memList.forEach((e) => {
        const innerArrM = [];
        innerArrM.push(e.im_rel_mem_id, e.im_rel_id, e.member_id);
        outerArrM.push(innerArrM);
      });
      setIMrelM(outerArrM);
    } else {
      setIMrelM([]);
    }

    setTitle(item.title);

    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    setVerArrFunc(item.ver);

    setId(item.id);
    setImage(item.image);
    setTeamIdList(exportFunction.getAllTeam());
    setMemberIdList(exportFunction.getAllMember());
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
          if (response.data) {
            window.location.reload();
          } else {
            window.alert("ブログ投稿エラーです");
          }
        })
        .catch(error => {});
    }
  };

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.IM + id)
        .then(response => {
          // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
          if (response.data) {
            window.location.reload();
          } else {
            window.alert("削除エラーです");
            console.log(response);
          }
        })
        .catch(error => {});
    }
  };

  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const handleChangeImage = e => {
    const txt = e.target.value;
    setImage(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
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
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const addVerArr = e => {
    if (e.keyCode === 13) {
      const tmpArr = [null, tmpVer, id];
      setVerArr([...verArr, tmpArr]);
      setTmpVer("");
      if (!editedFlg) {
        setEditedFlg(true);
      }
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
    .post(ApiPath.IM + "upd", data)
    .then(response => {
      if (response.data) {
        window.location.reload();
      } else {
        window.alert("更新エラーです");
      }
    })
    .catch(error => {});
  };

  const handleChangeAddIMrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...imrel];
    vers.push([null, id, teamIdTmp]);
    setIMrel(vers);
    setAddIMrelFlg(false);
  }

  const handleChangeAddIMrelM = e => {
    const memIdTmp = exportFunction.nameToMemberId(e.target.value);
    let vers = [...imrelM];
    vers.push([null, null, memIdTmp]);
    setIMrelM(vers);
    setAddIMrelMFlg(false);
  }

  const toggleEditedFlg = () => {
    if (editedFlg) {
      setEditedFlg(false);
    } else {
      setEditedFlg(true);
    }
  }

  const handleChangeIMrel = e => {
    // var prelId = e.target.name;
    var imrelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...imrel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[imrelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[imrelId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setIMrel(vers);
  }

  const handleChangeIMrelM = e => {
    // var prelId = e.target.name;
    var imrelMId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...imrelM];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[imrelMId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToMemberId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[imrelMId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setIMrelM(vers);
  }

  const toggleAddIMrelFlg = () => {
    if (addIMrelFlg) {
      setAddIMrelFlg(false);
    } else {
      setAddIMrelFlg(true);
    }
  }

  const toggleAddIMrelMFlg = () => {
    if (addIMrelMFlg) {
      setAddIMrelMFlg(false);
    } else {
      setAddIMrelMFlg(true);
    }
  }

  const selected = {
    opacity: 0.5,
  }

  return (
    <div className="itemContainer" className={item.wpId !== null && item.wpId !== undefined ? "postedStyle": editedFlg ? "editedStyle" : "notPostedStyle"}>
      {editedFlg ? (<div className="target_im" id={item.id} data-title={title} data-wpid={item.wpId} data-date={date} data-image={image} data-verarr={verArr}></div>) : (null)}
      <p>flg: {editedFlg ? "true" : "false"}</p>
      <Text>
        <ul>
          <li>
            {imrel !== null && imrel !== undefined ? (
              imrel.map((e, index) => (
                <div>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue=""
                  value={exportFunction.teamIdToName(e[2])}
                  label="Age"
                  onChange={handleChangeIMrel}
                  name={index}
                >
                {teamIdList !== null && teamIdList !== undefined ? (
                  teamIdList.map((f, index) => (
                    <MenuItem value={exportFunction.teamIdToName(f.id)} name={e[2]}>{exportFunction.teamIdToName(f.id)}</MenuItem>
                    ))
                ) : (
                  <></>
                )}
                </Select>
                </div>
                ))
            ) : (
              <></>
            )
          }

          {addIMrelFlg ? (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={exportFunction.teamIdToName(4)}
              label="Age"
              onChange={handleChangeAddIMrel}
              name="tmpIrel"
            >
            {teamIdList !== null && teamIdList !== undefined ? (
              teamIdList.map((f, index) => (
                <MenuItem value={exportFunction.teamIdToName(f.id)} name={4}>{exportFunction.teamIdToName(f.id)}</MenuItem>
                ))
            ) : (
              <></>
            )}
            </Select>
          ) : (
            <Btn onClick={toggleAddIMrelFlg}>+irelM</Btn>
          )}
          <br />
          {imrelM !== null && imrelM !== undefined ? (
            imrelM.map((e, index) => (
              <div>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.memberIdToName(e[2])}
                label="Age"
                onChange={handleChangeIMrelM}
                name={index}
              >
              {memberIdList !== null && memberIdList !== undefined ? (
                memberIdList.map((f, index) => (
                  <MenuItem value={exportFunction.memberIdToName(f.id)} name={e[2]}>{exportFunction.memberIdToName(f.id)}</MenuItem>
                  ))
              ) : (
                <></>
              )}
              </Select>
              </div>
              ))
            ) : (
              <></>
            )
          }
          {addIMrelMFlg ? (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={exportFunction.memberIdToName(30)}
              label="Age"
              onChange={handleChangeAddIMrelM}
              name="tmpIrelM"
            >
            {memberIdList !== null && memberIdList !== undefined ? (
              memberIdList.map((f, index) => (
                <MenuItem value={exportFunction.memberIdToName(f.id)} name={30}>{exportFunction.memberIdToName(f.id)}</MenuItem>
                ))
            ) : (
              <></>
            )}
            </Select>
          ) : (
            <Btn onClick={toggleAddIMrelMFlg}>+irelM</Btn>
          )}
            <br />
            {date}
            <br />
            <Btn onClick={toggleEditedFlg}>
              {editedFlg ? ("更新しない") : ("更新する")}
            </Btn>
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
          <li>
            <Btn onClick={delIm}>DELETE</Btn>
          </li>
          <li>
            <Btn onClick={upBlog} style={item.blog_not_updated ? null : selected}>Blog更新</Btn></li>
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
