import { Button, Input } from '@material-ui/core';
import React, { useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Room = () => {

    // 画面表示するやつ
    const [user, setUser] = useState('');
    // 実際にデータにセットするやつ
    const [userId, setUserId] = useState('');
    const [res, setRes] = useState([]);

    const handleChangeUserId = e => {
        const txt = e.target.value;
        setUser(txt);

        let txt1 = txt;
        if (txt.includes("https://room.rakuten.co.jp/")) {
            txt1 = txt.replace("https://room.rakuten.co.jp/", "");
        }

        let txt2 = txt1;
        if (txt1.includes("/items")) {
            txt2 = txt1.replace("/items", "");
        }
        setUserId(txt2);
    }

    /**
   　　* ユーザーのいいね検索依頼を出します
   　　*/
    const searchUser = e => {
        if (e.keyCode === 13) {
            const data = {
            user_id: userId
            }

            window.alert("処理を始めました");
            axios
            .post(ApiPath.ROOM + "seek_like", data)
            .then(response => {
                // if (response.data) {
                //     setRes(response.data);
                // } else {
                // window.alert("エラーです");
                // }
            })
            .catch(error => {
                if (error.code === "ECONNABORTED") {
                window.alert("タイムアウトしました");
                }
            });
        }
    }

    /**
     * htmlから要素を消します
     * 
     * @param {*} e 
     */
    const deleteElem = e => {
        var elem = document.getElementById(e);
        elem.remove();
    }

    /**
   　　* ユーザーがいいねしたユーザーを見ます
   　　*/
    const seeUserLikes = e => {
        if (e.keyCode === 13) {
            const data = {
            user_id: userId
            }
            axios
            .post(ApiPath.ROOM + "likes", data)
            .then(response => {
                if (response.data) {
                    setRes(response.data);
                } else {
                window.alert("エラーです");
                }
            })
            .catch(error => {
                if (error.code === "ECONNABORTED") {
                window.alert("タイムアウトしました");
                }
            });
        }
    }

    /**
   　　* 昨日いいねしてくれた人を見ます
   　　*/
    const seeLikedUsers = () => {
        axios
        .get(ApiPath.ROOM + "sug")
        .then(response => {
            if (response.data) {
                setRes(response.data);
            } else {
            window.alert("エラーです");
            }
        })
        .catch(error => {
            if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
            }
        });
    }

  return (
    <div>
        {/* ユーザーを入れる */}
        <div>
            <Input
                type="text"
                name="UserId"
                value={user}
                onChange={handleChangeUserId}
                placeholder="データDig"
                className="titleInput"
                onKeyDown={searchUser}
            />
            <Input
                type="text"
                name="UserId"
                value={user}
                onChange={handleChangeUserId}
                placeholder="Dig結果"
                className="titleInput"
                onKeyDown={seeUserLikes}
            />
            <Button onClick={seeLikedUsers}>昨日いいねしてくれた人</Button>
        </div>
        {/* 結果を入れる */}
        <div>
            <ul>
               {res.length > 0 ? (
                <div>
                    <p>ユーザー数：{res.length}</p>
                    {res.map((e, index) => (
                        <li id={e.replace(/.*:/,'')} onClick={() =>deleteElem(e.replace(/.*:/,''))}>
                            <a href={"https://room.rakuten.co.jp/" + e.replace(/.*:/,'') + "/items"} target="_blank">{e.replace(/.*:/,'')}</a>
                             【{e.replace(/:.*/,'')}】
                        </li>
                    ))}
                </div>
                ) : (
                    ""
                )} 
            </ul>
        </div>
    </div>
  );
};

export default Room;
