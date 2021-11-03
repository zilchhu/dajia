!(function() {
  let html = `
<style>
      .boss-reply-field {
          position: fixed;
          display: block;
          margin: auto;
          right: 20px;
          bottom: 20px;
          padding: 10px;
          width: 380px;
          background-color: #736e6ac2;
          color: #000;
          border-radius: 5px;
          box-shadow: 0 0 4px 2px #dedede;
      }

      .boss-reply-field span {
          margin: 0 3px;
      }

      .boss-reply-btn {
          position: fixed;
          display: block;
          margin: auto;
          right: 20px;
          bottom: 65px;
          padding: 2px;
      }

      #enableReplyBtn {
          box-sizing: border-box;
          position: relative;
          display: inline-block;
          padding: unset;
          margin: auto;
          opacity: 1;
          width: 25px;
          top: 3px;
      }

      #edit-modal,.greet-mod{
          display: none;
          position: fixed;
          left: 0px;
          top: 0px;
          width: 100%;
          height: 100%;
          text-align: center;
          z-index: 1000;
          background-color: #333;
          opacity: 0.8;
          overflow-y: scroll;
      }

      .modal-data,.greet-inner {
          width: 60%;
          margin: 10% auto;
          background-color: #fff;
          border: 1px solid #000;
          padding: 15px;
          text-align: center;
      }
      
      #addRuleRow{
      width: 30px;
      }
      
      .rmRow{
      width: 30px;
      }
      
      #job-tab,tr,td{
      margin: auto;
      border:1px solid black
      }

  </style>

<div class="greet-mod">
  <div class="greet-inner">
  <p><button>刷新职位</button><span id="greet-cnt">剩余招呼数：00</span></p>
  <table id="job-tab">
  <thead>
  <tr>
  <td>encryptId</td>
  <td>city</td>
  <td>addTimeDesc</td>
  <td>jobName</td>
  <td>salaryDesc</td>
  <td>招呼数</td>
</tr>
</thead>
  
</table>
  
  <button class="greet-mod-close">关闭</button>
</div>
  
</div>

<div id="edit-modal">
  <div class="modal-data">
      <button id="addRuleRow">+</button>
      <div id="customMsgRule">
      </div>
      <p>
          <button id="mod-save">保存</button>
          <button id="mod-close">关闭</button>
      </p>
  </div>
</div>

<div class="boss-reply-field" style="display:block">
  <p>新招呼回复内容</p>
  <textarea id="replyText" cols="30" rows="10" style="width:300px; height: 150px;"></textarea>
  <p><input type="checkbox" id="sendJobDetail" style="width:25px"/>发送职位描述</p>
  <p><input type="checkbox" id="sendLocaltion" style="width:25px"/>发送职位地址</p>
  <p><input type="checkbox" id="autoReply" style="width:25px"/>自定义消息
      <button id="editCustomMsg">编辑</button>
  </p>
  <p><input type="checkbox" id="autoGreet" style="width:25px"/>自动打招呼
      <button id="editJobGreet">设置</button>
  </p>
  <p><span>指定</span><input type="number" id="replyTime" value="24" style="width: 60px"/><span>小时内自动回复</span></p>
  <p><input type="checkbox" id="enableReplyBtn"/>启用新招呼自动回复</p>
  <p>
      <button id="saveReplyBtn">保存修改</button>
      <button id="saveToJsonText">保存配置到本地</button>
  </p>
  <p>
      <input type="file" id="bossconf" name="bossconf">
      <button id="updateConf">保存</button>
  </p>
</div>
<button class="boss-reply-btn">boss-自动回复</button>
`;

  if (document.querySelector(".boss-reply-field")) return;

  var element = document.createElement("div");
  element.innerHTML = html;
  element.style.position = "fixed";
  element.style.zIndex = "99999";
  document.body.appendChild(element);

  (async function() {
    sleep = function(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    bossTool = {
      replyConfig: {
        replyText: "你好",
        enable: false, //新招呼开启设置
        replyTime: 10, //指定小时内自动回复 新招呼/自定义消息 中使用
        sendLocaltion: false, //发送定位
        sendJobDetail: false, //发送职位描述
        sendExchange: false, //发送交换建立
        autoReply: false, //自动回复
        replyRule: {}, //自动回复匹配规则
        autoGreet: false, //自动打招呼
        jobGreet: {}, //自动招呼职位配置
        works: [], //在招职位
      },

      re: "",

      requests: async (o) => {
        let { method, url, body } = o;
        let response = await fetch(url, {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            token: window._PAGE.token,
            zp_token: window._PAGE.zp_token,
          },
          referrer: "https://www.zhipin.com/web/boss/index",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: body,
          method: method,
          mode: "cors",
          credentials: "include",
        });
        let ret = await response.json();
        return ret;
      },

      /**
       * 获取新招呼
       * @returns {Promise<*[]|*>}
       */
      getNewList: async () => {
        let ret = await bossTool.requests({
          method: "POST",
          url: "/wapi/zprelation/friend/filterV3.json",
          body:
            "jobId=-1&workflow=%E6%96%B0%E6%8B%9B%E5%91%BC&label=&conversationType=&page=1",
        });
        if (ret) {
          return ret.zpData.result
            .filter((d) => {
              return (
                d.updateTime >
                Date.now() - bossTool.replyConfig.replyTime * 3600 * 1000
              );
            })
            .map((d) => d.friendId);
        } else {
          console.log("getNewList error");
          return [];
        }
      },
      /**
       *获取用户信息
       * @param uids []
       * @returns {Promise<*[]|*>}
       */
      getUserDetail: async (uids) => {
        let friendIds = uids.join(",");
        let ret = await bossTool.requests({
          method: "POST",
          url: "/wapi/zprelation/friend/getBossFriendListV2.json",
          body: `page=1&friendIds=${friendIds}&dzFriendIds=`,
        });
        if (ret) {
          return ret.zpData.friendList;
        } else {
          console.log("getUserDetail error");
          return [];
        }
      },
      /**
       * 发信息
       * @param user
       * @param msg
       */
      sendMsg: (user, msg) => {
        window.sss.sendMessage(user, msg);
      },
      /**
       * 发定位
       * @param user
       * @returns {Promise<boolean|*>}
       */
      sendLocaltion: async (user) => {
        let ret = await bossTool.requests({
          method: "POST",
          url: "/wapi/zpchat/message/sendJobLocation",
          body: `jobId=${user.jobId}&toUserId=${user.uid}&securityId=${user.securityId}`,
        });
        if (ret) {
          return ret.zpData;
        } else {
          console.log("sendLocaltion error");
          return false;
        }
      },
      /**
       * 获取职位描述
       * @param jobt
       * @returns {Promise<string|*>}
       */
      getJobDetail: async (jobt) => {
        let ret = await bossTool.requests({
          method: "GET",
          url: `/wapi/zpjob/job/info/chat/detail/${jobt}`,
          body: null,
        });
        if (ret) {
          return ret.zpData.chatJobInfoDetail.postDescription;
        } else {
          console.log("getJobDetail error");
          return "";
        }
      },
      /**
       * 获取用户职位
       * @param user
       * @returns {Promise<string|string|*>}
       */
      getUserJob: async (user) => {
        let ret = await bossTool.requests({
          method: "GET",
          url: `/wapi/zpjob/chat/geek/info?uid=${user.uid}&geekSource=0&securityId=${user.securityId}`,
          body: null,
        });
        if (ret) {
          return ret.zpData.data.toPositionId;
        } else {
          console.log("getUserJob error");
          return "";
        }
      },
      /**
       * 交换简历
       * @param user
       * @returns {Promise<string|string|*>}
       */
      sendExchange: async (user) => {
        let ret = await bossTool.requests({
          method: "POST",
          url: "/wapi/zpchat/exchange/request",
          body: `type=4&securityId=${user.securityId}`,
        });
        if (ret) {
          return ret.zpData.data.toPositionId;
        } else {
          console.log("getUserJob error");
          return "";
        }
      },
      /**
       * 新沟通回复
       * @param user
       * @returns {Promise<void>}
       */
      reply: async (user) => {
        console.log(user);
        if (bossTool.replyConfig.replyText) {
          window.sss.sendMessage(user, bossTool.replyConfig.replyText);
        }
        if (bossTool.replyConfig.sendJobDetail) {
          let job = await bossTool.getUserJob(user);
          if (!job) {
            console.log("error");
            return;
          }
          let jobDetail = await bossTool.getJobDetail(job);

          window.sss.sendMessage(user, jobDetail);
        }

        if (bossTool.replyConfig.sendLocaltion) {
          await bossTool.sendLocaltion(user);
        }
        if (bossTool.replyConfig.sendExchange) {
          bossTool.sendExchange(user);
        }
      },
      /**
       * 新沟通 轮询
       */
      timer: setInterval(async () => {
        if (bossTool.replyConfig.enable && bossTool.replyConfig.replyText) {
          let uids = await bossTool.getNewList();
          console.log(uids);
          if (uids.length > 0) {
            let users = await bossTool.getUserDetail(uids);
            console.log(users);
            for (let i = 0; i < users.length; i++) {
              if (bossTool.replyConfig.enable) {
                await bossTool.reply(users[i]);
                await sleep(0.5 * 1e3);
              }
            }
            // users.map((user) => {
            //     R.reply(user)
            // })
          }
        }
      }, 20000),
      /**
       * 消息处理
       * @param msg
       * @returns {Promise<void>}
       */
      recv: async (msg) => {
        msg.messages.map((m) => {
          if (
            m.from.uid != window._PAGE.uid &&
            m.body.text &&
            !m.body.hyperLink &&
            m.body.templateId == 1
          ) {
            console.log(m.from.uid, m.from.name, m.body.text, m);
            if (
              bossTool.replyConfig.autoReply &&
              m.time > Date.now() - bossTool.replyConfig.replyTime * 3600 * 1000
            ) {
              let t = m.body.text;
              let x = t.match(bossTool.re);
              console.log("-----", x);
              if (x) {
                x = x[0];
                let a = bossTool.replyConfig.replyRule[x];
                if (a) {
                  bossTool
                    .getUserDetail([m.from.uid])
                    .then((res) => sss.sendMessage(res[0], a));
                }
              }
            }
          }
        });
      },
      /**
       * 获取打开的职位
       * @returns {Promise<string|*>}
       */
      getOpenJob: async () => {
        let ret = await bossTool.requests({
          method: "GET",
          url: `/wapi/zpjob/job/data/list?position=0&type=1&searchStr=&page=1&_=1632720663774`,
          body: null,
        });

        if (ret) {
          return ret.zpData.data;
        } else {
          console.log("getOpenJob error");
          return "";
        }
      },
      /**
       * 推荐牛人
       * @param work
       * @param page
       * @returns {Promise<string|*>}
       */
      getGeekList: async (work, page = 1) => {
        let ret = await bossTool.requests({
          method: "GET",
          url: `/wapi/zpjob/rec/geek/list?age=16,-1&gender=0&exchangeResumeWithColleague=0&activation=0&recentNotView=0&experience=0&degree=0&salary=0&intention=0&refresh=${Date.now()}&jobid=${
            work.encryptId
          }&source=0&cityCode=&districtCode=&businessId=&jobId=${
            work.encryptId
          }&page=${page}&_=${Date.now()}`,
          body: null,
        });

        if (ret) {
          return ret.zpData.geekList;
        } else {
          console.log("getNiuRens error");
          return "";
        }
      },
      /**
       * 打招呼
       * @param geek
       * @returns {Promise<string|any>}
       */
      greet: async (geek) => {
        let ret = await bossTool.requests({
          method: "POST",
          url: `/wapi/zpboss/h5/chat/start?_=${Date.now()}`,
          body: `gid=${geek.encryptGeekId}&suid=&jid=${
            geek.geekCard.encryptJobId
          }&expectId=${geek.geekCard.expectId}&lid=${geek.geekCard.lid.replace(
            ":",
            "%3A"
          )}&from=&securityId=${geek.geekCard.securityId}`,
        });

        if (ret) {
          return ret;
        } else {
          console.log("greet error");
          return "";
        }
      },
    };

    function onNumberChange(work, num) {
      console.log(work, num)
    }

    bossTool.replyConfig.works = await bossTool.getOpenJob();
    bossTool.replyConfig.works.map((work) => {
      $("#job-tab").append(`
        <tr>
          <td>${work.encryptId}</td>
          <td>${work.city}</td>
          <td>${work.addTimeDesc}</td>
          <td>${work.jobName}</td>
          <td>${work.salaryDesc}</td>
          <td><input type="number" onchange="onNumberChange(work)"></td>
        </tr>
          `);
    });
    // .then(ret=>bossTool.replyConfig.works=ret)
    var configData = window.localStorage.getItem("boss_reply");
    if (configData) {
      bossTool.replyConfig = {
        ...bossTool.replyConfig,
        ...JSON.parse(configData),
      };
    }

    $("#saveReplyBtn").click(function() {
      try {
        bossTool.replyConfig.replyText = $("#replyText").val();
        bossTool.replyConfig.replyTime = parseInt($("#replyTime").val());
        bossTool.replyConfig.enable = $("#enableReplyBtn").is(":checked");
        bossTool.replyConfig.sendLocaltion = $("#sendLocaltion").is(":checked");
        bossTool.replyConfig.sendJobDetail = $("#sendJobDetail").is(":checked");
        bossTool.replyConfig.sendExchange = $("#sendExchange").is(":checked");
        bossTool.replyConfig.autoGreet = $("#autoGreet").is(":checked");
        bossTool.replyConfig.autoReply = $("#autoReply").is(":checked");
        bossTool.replyConfig.replyRule = getMsgRule();
        saveConf();
      } catch (e) {}
    });

    $(".boss-reply-btn").click(() => {
      let a = $(".boss-reply-field");
      a.is(":hidden") ? a.show() : a.hide();
    });

    $("#editCustomMsg,#mod-close").click(() => {
      let a = $("#edit-modal");
      a.is(":hidden") ? a.show() : a.hide();
    });

    $("#mod-save").click(() => {
      $("#edit-modal").hide();
      bossTool.replyConfig.replyRule = getMsgRule();
      saveConf();
    });

    //获取自定义回复规则
    function getMsgRule() {
      let a = {};
      $("#customMsgRule p").each(function() {
        let l = [];
        $(this)
          .children()
          .each(function() {
            l.push($(this).val());
          });
        if (l[0] && l[1]) {
          a[l[0]] = l[1];
        }
      });
      return a;
    }

    function saveConf() {
      if (bossTool.replyConfig.replyRule) {
        bossTool.re = new RegExp(
          Object.keys(bossTool.replyConfig.replyRule).join("|"),
          "im"
        );
      }
      localStorage.setItem("boss_reply", JSON.stringify(bossTool.replyConfig));
    }

    function setConf() {
      $("#replyText").val(bossTool.replyConfig.replyText);
      $("#replyTime").val(bossTool.replyConfig.replyTime);
      $("#enableReplyBtn").attr("checked", bossTool.replyConfig.enable);
      $("#sendLocaltion").attr("checked", bossTool.replyConfig.sendLocaltion);
      $("#sendJobDetail").attr("checked", bossTool.replyConfig.sendJobDetail);
      $("#sendExchange").attr("checked", bossTool.replyConfig.sendExchange);
      $("#autoGreet").attr("checked", bossTool.replyConfig.autoGreet);
      $("#autoReply").attr("checked", bossTool.replyConfig.autoReply);
      let msgRule = bossTool.replyConfig.replyRule;
      if (bossTool.replyConfig.replyRule) {
        console.log("------------");
        bossTool.re = new RegExp(
          Object.keys(bossTool.replyConfig.replyRule).join("|"),
          "im"
        );
      }
      $("#customMsgRule p").remove();
      if (msgRule) {
        Object.entries(msgRule).map((x) => {
          $("#customMsgRule").append(
            `<p>规则：<input type="text" style="width: 10%;height: 30px" value="${x[0]}">回复内容：<input type="text" style="width: 60%;height: 30px" value="${x[1]}"><button class="rmRow">-</button></p>`
          );
        });
      }
    }

    setConf();

    $("#updateConf").click(async function() {
      let files = $("#bossconf").prop("files");
      try {
        let f = files[0];
        let t = await f.text();
        let conf = JSON.parse(t);
        console.log(t);
        bossTool.replyConfig = { ...bossTool.replyConfig, ...conf };
        setConf();
        saveConf();

        alert(`更新成功${t}`);
      } catch (e) {
        console.log(e);
        alert("更新失败");
      }
    });

    $("#addRuleRow").click(() => {
      $("#customMsgRule").append(
        '<p>规则：<input type="text" style="width: 10%;height: 30px">回复内容：<input type="text" style="width: 60%;height: 30px"><button class="rmRow">-</button></p>'
      );
    });

    $(document).on("click", ".rmRow", function() {
      $(this)
        .parent()
        .remove();
    });
    //保存配置到本地
    $("#saveToJsonText").click(() => {
      let content = localStorage.getItem("boss_reply");
      let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      let objectURL = URL.createObjectURL(blob);
      let anchor = document.createElement("a");
      anchor.href = objectURL;
      anchor.download = "boss.json";
      anchor.click();
      URL.revokeObjectURL(objectURL);
    });

    $("#editJobGreet,.greet-mod-close").click(() => {
      let a = $(".greet-mod");
      a.is(":hidden") ? a.show() : a.hide();
    });
  })();
})();
