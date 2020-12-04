<template>
    <div class="center-container">
        <div id="login">
            <input id="login-inp" placeholder="Type your name" autofocus="true" type="text" v-on:keyup.enter="enterChat" name="name" v-model="input.name"/>
            <button  type="button" v-on:click="enterChat">Enter Chat</button>
        </div>
        <div class="marginTop25">
            <div class="header">App Features:</div>
            <ul>
                <li>Group chat</li>
                <li>Online users</li>
                <li>Private Chat</li>
            </ul>
        </div>
    </div>
</template>

<script>
import router from "../Router";
import socket from "../Socket";

export default {
    name:'Login',
    data(){
        return{
            input:{
                name:''
            },
            socket:socket
        }
    },
    methods:{
        enterChat(){
            if(this.input.name.trim()!==""){
                this.socket.emit('JOIN_USER',this.input.name);
                router.push("/home");
            }
            const el = document.getElementById("login-inp");
            el && el.focus();
        }
    }  
}
</script>

<style scoped>
    #login{
        margin-top: 30px; 
    }
    input{
        outline: none;
        border: 2px solid black;
        height: 35px;
        padding-left: 10px;
    }

    button{
        margin-left: 20px;
        height: 35px;
        background-color: cadetblue;
        box-shadow: none;
        border: 2px solid black;
    }

    .marginTop25{
        margin-top: 25px;
    }
    .center-container{
       width: 350px;
       margin: 0 auto;
       border: 1px solid #000;
       padding: 25px;
       border-radius: 5px;
    }
</style>>