<template>
<div class="home">
    <div id="online">
        <Online v-bind:users="users" v-bind:id="id"  v-on:setChatUser="setChatUser"/>
    </div>
    <div id="groupchat">
        <div class="group-chat-header">
            Group chat window
            <span v-for="(item, index) in users" v-bind:key="index">
                <span v-if="item.id==id">
                ( WELCOME - {{item.name.toUpperCase()}} )
                </span>
            </span>
        </div>
        <div id= "chat-window" class="chat-window">
            <div class="chat-msg" v-for="(item, index) in message" v-bind:key="index">
                <div v-if="item.id==id">
                    <img src="https://semantic-ui.com/images/avatar2/large/patrick.png" class="left"  alt="Avatar" style="width:100%;"/>
                    <div class="leftmsg">
                        <i>You({{item.from}})</i>:&nbsp;{{item.msg}}
                    </div>
                </div>
                <div v-else>
                    <img src="https://semantic-ui.com/images/avatar2/small/elyse.png" class="right"  alt="Avatar" style="width:100%;"/>
                    <div class="rightmsg">
                        <i>{{item.from }}</i>:&nbsp;{{item.msg}}
                    </div>
                </div>
            </div>
            <div id="last-msg"/>
        </div>
        <div class="chat-input">
            <input id="chat-inp" type="text" placeholder="Type message here" v-model="input.chat" v-on:keyup.enter="sendMsg"/>
            <button  type="button" v-on:click="sendMsg">Send</button>
        </div>
    </div>
    <div class="chat-popup form-container" id="myForm">
        <div>
            <span v-if="selectedUser!=null" class="online-dot"/>
            <label for="msg"><b>{{selectedUser  && selectedUser.name}}</b></label>
        </div>
        
        <label for="msg">Private Chat Type Message</label>
        <textarea class="textarea" v-model="input.msgBox"/>
        <button type="button" class="btn" v-on:click="sendMessageUser">Send</button>
        <button type="button" class="btn cancel" v-on:click="closeForm">Close</button>

    </div>
</div>
</template>

<script>
import socket from "../Socket";
import Online from "./Online";
import router from "../Router";

export default {
    name:'Home',
    components:{
        Online
    },
    data(){
        return{
            input:{
                chat:'',
                msgBox:''
            },
            message:[],
            socket:socket,
            id:'',
            users:[],
            selectedUser:null
        }
    },
    mounted(){   
        this.socket.emit('GET_SOCKET');
        this.socket.on('GET_SOCKET',(id)=>{
             this.id = id;
        });
        
        const element  = document.getElementById("chat-inp");
        element && element.focus();
        
        this.socket.on('GROUP_CHAT_MESSAGE',(Obj)=>{
            this.message.push(Obj);          
            setTimeout(function(){
                    const element = document.getElementById("last-msg");
                    element && element.scrollIntoView({behavior: 'smooth', block: 'end'});
            },300);
        });

        this.socket.on('REFRESH_USER',(users)=>{
            this.users = users;
            const loggedUser = users.find(user=>user.id === this.id);
            if(this.selectedUser){
                 const selectedUserInList = users.find(user=>user.id === this.selectedUser.id);
                 if(!selectedUserInList){
                     this.selectedUser = null;
                     this.closeForm();
                 }
            }
            if(!loggedUser){
                return router.push("/");
            }
        })

    },
    methods:{
        sendMsg(){
            const element  = document.getElementById("chat-inp");
            if(this.input.chat.trim()!==""){
                this.socket.emit('GROUP_CHAT_MESSAGE',{msg:this.input.chat})
                this.input.chat = "";
            }
            element && element.focus();
        },
        openForm() {
             document.getElementById("myForm").style.display = "block";
             const element = document.getElementsByClassName('textarea')[0];
              element && element.focus();
        },
        closeForm() {
            document.getElementById("myForm").style.display = "none";
            this.selectedUser = null;
            this.input.msgBox = "";
        },
        setChatUser(user){
            this.selectedUser = user;
            this.openForm()
        },
        sendMessageUser(){
            const element = document.getElementsByClassName('textarea')[0];
            if(this.input.msgBox.trim()!==""){
                    if(this.selectedUser){
                    const user = this.users.find(user=>user.id==this.id);
                    if(user){
                        const data = {
                            id:this.selectedUser.id,
                            msg:this.input.msgBox,
                            name: user.name    
                        };
                        this.socket.emit('SEND_MESSAGE_USER',data);
                    }
                }
                this.input.msgBox = "";
            }
            element && element.focus();
        }
    }  
}
</script>

<style scoped>
.home{
    display: flex;
}
#online{
    margin-right: 10px;
}
.chat-input{
    margin-top: 20px;
}

 input{
    outline: none;
    border: 1px solid grey;
    height: 35px;
    padding-left: 10px;
}

button{
    margin-left: 10px;
    height: 35px;
    background-color: cadetblue;
    box-shadow: none;
    border: 1px solid grey;
}

.chat-window{
    padding-top:30px;
    padding-bottom: 5px;
    padding-left: 20px;
    padding-right: 20px;
    height: 430px;
    width: 800px;
    overflow-y: auto;
    border: 1px solid grey;;
}

.chat-msg{
    width: 100%;
    display: inline-block;
    margin-top: 5px;
}

.chat-msg img.left {
  float: left;
  max-width: 30px;
  margin-right: 20px;
  border-radius: 50%;
}

.chat-msg img.right {
  float: right;
  max-width: 30px;
  margin-left: 20px;
  border-radius: 50%;
}


.chat-msg .leftmsg {
  float: left;
  border-radius: 6px;
  background-color: purple;
  width: 400px;
  min-height: 40px;
  padding: 10px;
  color:white;
  word-break: break-word;
  opacity: 0.8;
}

.chat-msg .rightmsg {
  float: right;
  border-radius: 6px;
  background-color: #6610f2;
  width: 400px;
  min-height: 40px;
  padding: 10px;
  color:white;
  word-break: break-word;
  opacity: 0.8;
}

#last-msg{ 
    height: 40px; 
}


/* private chat css*/
.open-button {
  background-color:purple;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 0px;
  right: 28px;
  width: 300px;
  padding-top: 10px;
  padding-bottom: 20px;
}

.chat-popup {
  display: none;
  position: fixed;
  bottom: 0;
  right: 15px;
  border: 1px solid grey;
  z-index: 9;
}

.form-container {
  width: 300px;
  padding: 10px;
  background-color: white;
}

.form-container .textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
  resize: none;
  height:200px;
  overflow-y: auto;
}

.form-container .btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
  margin-left: 0px;
}

.form-container .cancel {
  background-color: red;
}

.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}

.online-dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-right:5px;
  opacity: 0.8;
}

.group-chat-header{
    padding: 8px;
    background-color: purple;
    color: white;
    font-weight: 500;
    opacity: 0.8;
}
</style>