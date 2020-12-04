<template>
   <div class="online-users">
       <div class="online-header">Online&nbsp;
           (&nbsp; {{users.filter(user=>user.id!==id).length}} &nbsp;)
        </div>
       <div v-for="(item, index) in users" v-bind:key="index">
            <div class="online-row" v-if="item.id!==id" v-on:click="setChatUser(item)">
                <span class="online-dot"></span>
                {{item.name}}
            </div>
       </div>
   </div>
</template>

<script>
export default {
    name:'Online',
    props:['users','id'],
    methods:{
        setChatUser(user){
            this.$emit('setChatUser', user)
        }
    }
}
</script>

<style scoped>
.online-users{
    width: 200px;
    height:300px;
    overflow-y: auto;
    border: 1px solid grey;
}
.online-header{
    padding: 8px;
    background-color: purple;
    color: white;
    font-weight: 500;
    opacity: 0.8;
}
.online-row{
    padding: 5px 5px 5px 8px;
    border-bottom: 1px solid grey;
    word-break: break-word;
}
.online-row:last-of-type{
    border-bottom: none;
}

.online-row:hover{
    background-color: lavender;
    cursor: pointer;

}

.online-dot {
  height: 10px;
  width: 10px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-right:5px;
  opacity: 0.8;
}
</style>>

