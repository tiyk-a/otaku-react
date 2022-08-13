import { Box, Button, TextField, Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import exportFunction from '../functions/TeamIdToName';
import axios from '../axios';
import { ApiPath } from '../constants';
import NativeSelect from '@mui/material/NativeSelect';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const ItemM = ({ item }) => {
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY/MM/DD');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [tmpVer, setTmpVer] = useState('');
  const [editedFlg, setEditedFlg] = useState(false);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memIdList, setMemIdList] = useState([]);
  const [allTeamIdList, setAllTeamIdList] = useState([]);
  const [allMemIdList, setAllMemIdList] = useState([]);
  const [addIMrelFlg, setAddIMrelFlg] = useState(false);
  const [media, setMedia] = useState(1);
  const [showMem, setShowMem] = useState(false);

  useEffect(() => {
    // メディア判定
    isSmartPhone();

    setTitle(item.title);

    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    setVerArrFunc(item.ver);

    setId(item.id);
    setImage(item.image);
    setTeamIdList(item.teamArr);
    setMemIdList(item.memArr);
    setAllTeamIdList(exportFunction.getAllTeam());
    setAllMemIdList(exportFunction.getAllMember());
  }, [item.id, item.image, item.relList, item.relMList, item.title, item.ver, item.teamArr, item.memArr]);

  // メディア判別
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

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
    window.alert("ブログ更新発火！処理します");
    await axios
      .get(ApiPath.IM + 'blog?imId=' + id, item)
      .then(response => {
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          window.location.href = newUrl;
        } else {
          window.alert("ブログ投稿エラーです");
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  };

  const delIm = async () => {
    await axios
      .delete(ApiPath.IM + id)
      .then(response => {
        // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          window.location.href = newUrl;
        } else {
          window.alert("削除エラーです");
          console.log(response);
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
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

  const toggleShowMem = () => {
    if (!showMem) {
      setShowMem(true);
    } else {
      setShowMem(false);
    }
  }

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
      teamArr: teamIdList.join(', '),
      memArr: memIdList.join(', '),
    }

    await axios
    .post(ApiPath.IM + "upd", data)
    .then(response => {
      if (response.data) {
        var tmpUrl = window.location.href;
        var newUrl = tmpUrl.replace("http://localhost:3000/", "");
        window.location.href = newUrl;
      } else {
        window.alert("更新エラーです");
      }
    })
    .catch(error => {
      if (error.code === "ECONNABORTED") {
        window.alert("タイムアウトしました");
      }
    });
  };

  const updEyeCatch = async () => {
    await axios
    .get(ApiPath.IM + "eye?id=" + id)
    .then(response => {
      if (response.data) {
        var tmpUrl = window.location.href;
        var newUrl = tmpUrl.replace("http://localhost:3000/", "");
        window.location.href = newUrl;
      } else {
        window.alert("更新エラーです");
      }
    })
    .catch(error => {
      if (error.code === "ECONNABORTED") {
        window.alert("タイムアウトしました");
      }
    });
  }

  const handleChangeAddIMrel = e => {
    var teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let tmpList = [...teamIdList];
    tmpList.push(teamIdTmp);
    setTeamIdList(tmpList);
  }

  const handleChangeTeam = e => {
    var arr = e.target.value.split(":");
    var teamId = exportFunction.nameToTeamId(arr[0]);
    var index = arr[1];
    let tmpList = [...teamIdList];
    tmpList[index] = teamId;
    setTeamIdList(tmpList);
  }

  const toggleAddIMrelFlg = () => {
    if (addIMrelFlg) {
      setAddIMrelFlg(false);
    } else {
      setAddIMrelFlg(true);
    }
  }

  // そのチームをirelMから抜きます
  const minusImrel = (index) => {
    let tmpList = [...teamIdList];
    // imrelデータでなく、irelが最低1つあれば削除可能。imrelデータだったら未選択のままにして、ポストしてdel_flg=trueにしましょう
    if (tmpList.length > 1) {
      tmpList.splice(index, 1);
    }
    setTeamIdList(tmpList);
  }

  // メンバーがirelMに入っていなかったら追加、入っていたら抜く
  const toggleImrelM = (memberId) => {
    var tmpList = [...memIdList];
    // https://stackoverflow.com/questions/61997123/how-to-delete-a-value-from-array-if-exist-or-push-it-to-array-if-not-exists
    if(!tmpList.includes(memberId)){ //checking weather array contain the id
        tmpList.push(memberId); //adding to array because value doesnt exists
    }else{
        tmpList.splice(tmpList.indexOf(memberId), 1); //deleting
    }
    setMemIdList(tmpList);
  }

  const selected = {
    opacity: 0.5,
  }

  return (
    <div className={item.wpId !== null && item.wpId !== undefined ? "postedStyle itemContainer": editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"}>
      {editedFlg ? (<div className="target_im" id={item.id} data-title={title} data-wpid={item.wpId} data-date={date} data-image={image} data-verarr={verArr} data-teamarr={teamIdList} data-memarr={memIdList}></div>) : (null)}
      <Text>
        <ul style={media === 1 ? row : column}>
          <li style={media === 1 ? null : column}>
            {function () {
              if (teamIdList !== null && teamIdList !== undefined) {
                return (
                  <>
                    {function() {
                      if (showMem) {
                        return (
                          <Btn onClick={toggleShowMem}>Mem編集完了</Btn>
                        )
                      } else {
                        return (
                          <Btn onClick={toggleShowMem}>Mem編集</Btn>
                        )
                      }
                    }()}
                    {teamIdList.map((e, index) => (
                      <div className={media === 1 ? row : column}>
                        <NativeSelect
                          labelId="demo-simple-select-label"
                          id={e}
                          defaultValue=""
                          value={exportFunction.teamIdToName(e) + ":" + index}
                          label="Team"
                          onChange={handleChangeTeam}
                          name={index}
                        >
                        {allTeamIdList !== null && allTeamIdList !== undefined ? (
                          allTeamIdList.map((f, index2) => (
                            //
                            <option key={e} value={exportFunction.teamIdToName(f.id) + ":" + index}>
                              {/*  */}
                              {exportFunction.teamIdToName(f.id)}
                            </option>
                            ))
                        ) : (
                          <></>
                        )}
                        </NativeSelect>
                        {e === 4 ? (
                          <RemoveIcon onClick={() => minusImrel(index)} />
                        ) : (null)
                        }
                        {function() {
                          if (showMem) {
                            return (
                              <div class="flex_column width_6rem">
                                {function() {
                                  if (allMemIdList !== null && allMemIdList !== undefined) {
                                    return (
                                      <div>
                                        {allMemIdList.map((g, index) => (
                                          <div>
                                            {function() {
                                              if (g.teamId === Number(e)) {
                                                if (memIdList.includes(g.id)) {
                                                  return (
                                                    <div>
                                                      <p className="colorRed" onClick={() => toggleImrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                    </div>
                                                )
                                                } else {
                                                  return (
                                                    <div>
                                                      <p onClick={() => toggleImrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                    </div>
                                                  )
                                                }
                                              }
                                            }()}
                                          </div>
                                        ))}
                                      </div>
                                    )
                                }
                                }()}
                              </div>
                            )
                          }
                        }()}
                      </div>
                  ))}
                  </>
                )
              }
            }()}
          <div style={row}>
            {addIMrelFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={handleChangeAddIMrel}
                name="tmpIrel"
              >
              {allTeamIdList !== null && allTeamIdList !== undefined ? (
                allTeamIdList.map((f, index2) => (
                  <option key={4} value={exportFunction.teamIdToName(f.id)}>
                    {exportFunction.teamIdToName(f.id)}
                  </option>
                  ))
              ) : (
                <></>
              )}
              </NativeSelect>
            ) : (
              <Btn onClick={toggleAddIMrelFlg}>+imrel</Btn>
            )}
          </div>
          </li>
          <li>
            IMId: {item.id}
            <br />
            WpId: {item.wpId !== null && item.wpId !== undefined ? (item.wpId) : ("✖️")}
            <br />
            {date}
          </li>
          <li className={media === 1 ? "textBoxTitle" : "textBoxTitleSp"}>
            <Input
              type="text"
              name="IM register"
              value={title}
              onChange={handleChangeTitle}
              placeholder="imId"
              className="titleInput"
            />
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
          <li className={media === 1 ? "textBox" : "textBoxSp"}>
            <Input
              type="text"
              row="5"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="バージョン(記号x,Enterで追加)"
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
            <span style={media === 1 ? column : column}>
              <Btn onClick={updIM}>IM更新</Btn>
              <Btn onClick={updEyeCatch}>アイキャッチ更新</Btn>
              <Btn onClick={upBlog} style={item.blog_not_updated ? null : selected}>Blog更新</Btn>
              <Btn onClick={delIm}>DELETE</Btn>
            </span>
          </li>
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
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
});

const RemoveIcon = styled(RemoveCircleOutlineIcon)({
  // TODO:高さがselectorsと一緒になるように揃えたい
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.5',
    transition: 'opacity 0.5s',
  },
});

const row = {
  "display" : "flex",
  "flex-direction" : "row"
}

const column = {
  "display" : "flex",
  "flex-direction" :"column"
}

export default ItemM;
