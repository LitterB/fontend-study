<template>
    <div>
        <div class="navbar">
            <span class="navbar-text">{{title}}</span>
        </div>

        <div class="content">
            <div>
                <ul class="message-content" ref="messageContent">
                    <li v-for="(item, index) in showMsgDatas" :key="index">
                        <chat-item :chatItemObj="item"></chat-item>
                    </li>
                </ul>
            </div>

            <chat-feature :inputDisable="inputDisable" :rightDatas="rightDatas" @onRightSelectMsg="onRightSelectMsg"></chat-feature>
        </div>
    </div>
</template>

<script>
    import ChatItem from '../components/ChatItem.vue';
    import ChatFeature from '../components/ChatFeature.vue';
    export default{
        data: function(){
            return {
                title: '和LGD_Sunday聊天中...',
                inputDisable: true, //是否正在输入
                chatDatas: [], //所有的聊天数据
                showMsgDatas: [],//展示出的聊天数据
                selectMsgData: {},//选中的聊天数据
                rightDatas: [] //要说的话
            }
        },
        components: {
            'chat-item': ChatItem,
            'chat-feature': ChatFeature
        },
        created: function() {
            this.loadChatData();
        },
        methods: {
            scrollContent: function(){
                this.$nextTick(function(){
                    var msgContent = this.$refs.messageContent;
                    msgContent.scrollTop = msgContent.scrollHeight;
                })
            },
            //获取聊天数据
            loadChatData: function(){
                var $this = this;
                this.$http.get('../../static/chatData.json')
                    .then(function(res){
                        $this.chatDatas = res.data.msgData;
                        $this.setMsg('001');
                    })
            },
            //自动对话
            setMsg: function(selectId){
                this.selectMsgData = this.chatDatas.filter((item) => {
                    return item.id === selectId;
                })[0];
                //设置leftData
                this.setShowMsgDatas(this.selectMsgData.leftMsg, 'left');
                //获取到所有的rightData
                this.rightDatas = this.selectMsgData.rightData;
            },
            //设置展示数据
            setShowMsgDatas: function(msgData, type){
                var $this = this;
                //已添加进展示数据的条目
                var i = 0;
                //对数据的类型进行判断，是属于对方还是己方
                if ('left' === type){
                    // 修改我们的title，我们需要在data中定义我们的title
                    $this.title = 'LGD_Sunday正在输入....';
                    // inputDisable, 表示对方正在输入，这个时候“我”是不可以进行选择的。
                    $this.inputDisable = true;
                    // 通过定时器来制造“对方”输入的延迟
                    var interval = setInterval(function(){
                        // 把需要显示的数据添加到showMsgDatas中
                        $this.showMsgDatas.push({
                            id: $this.selectMsgData.id,
                            msg: msgData[i],
                            type: type
                        });
                        // 添加完成之后判断当前的content是否需要滚动
                        $this.scrollContent();
                        // 展示数据条目自增
                        i++;
                        // 判断需要展示的数据是否已经全部展示完毕
                        if (i >= msgData.length) {
                            // 修改我们的title
                            $this.title = '和LGD_Sunday聊天中';
                            // 重置inputDisable
                            $this.inputDisable = false;
                            //清理掉定时器
                            window.clearInterval(interval);
                            return;
                        }
                    }, 1000);
                }else{
                    // 如果是“我”发送的消息，则直接push到showMsgDatas
                    this.showMsgDatas.push({
                        id: $this.selectMsgData.id,
                        msg: msgData[0],
                        type: type
                    });
                    //执行页面滚动
                    $this.scrollContent();
                }
            },
            onRightSelectMsg: function(item) {
                //调用setShowMsgDatas 放置“我”的聊天数据
                this.setShowMsgDatas(item.rightMsg, 'right');
                // 调用setMsg执行“我”的聊天信息对应的自动对话
                this.setMsg(item.id);
            }
        }
    }
</script>

<style scoped>
  .navbar {
    height: 44px;
    display: flex;
  }
  .navbar-text {
    margin: 0 auto;
    line-height: 44px;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 0;
    right: 0;
    left: 0;
    background: linear-gradient(to bottom, #57b1ff, #c0e2ff);
  }
  .message-content {
    position: absolute;
    top: 0;
    bottom: 45px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .animated {
      -webkit-animation-duration: .4s;
      animation-duration: .4s;
  }
</style>
