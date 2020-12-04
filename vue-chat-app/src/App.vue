<template>
  <div class="main">
      <div class="msgContainer">
        <div v-for="(item, index) in messages" v-bind:key="index" class="alert alert-info alert-dismissible fade show" role="alert">
          <strong><i>{{item.name}}:</i></strong>&nbsp;{{item.msg}}
            <span class="close" aria-hidden="true" v-on:click="deleteMsg(index)">&times;</span>
        </div>
    </div>
    <div id="app">
      <div class="header">
          <img id="logo" alt="Vue logo" src="./assets/logo.png"/>
            CHAT APPLICATION
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Socket from "./Socket";
export default {
  name: 'App',
  data(){
   return {
      messages:[],
      socket:Socket,
    }
  },
  mounted(){
    this.socket.on('SEND_MESSAGE_USER',(msgObj)=>{
      this.messages.unshift(msgObj);
    });
  },
  methods:{
    deleteMsg(index){
      this.messages.splice(index,1);
    }
  }
}
</script>


<style>
#logo{
  height: 50px;
  width: 50px;
}
#app {
  width: 80%;
  margin: 0 auto;
  padding: 10px 20px 10px 20px;
}

.header{
  font-size: larger;
  font-weight: inherit;
  padding-top: 20px;
  padding-bottom: 20px;
}

.msgContainer{
   position: fixed;
   top:0px;
   right: 0px;
   margin:30px;
   z-index: 999;
}

.alert{
  max-width: 600px;
}

.close{
  cursor: pointer;
}
</style>
