<template>
  <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" >
        <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
     <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
     <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
    props:{
        food:{
            type:Object //接收父组件goods传过来的数组-->
        },
    },
   methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1); //设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。
        } else {
          this.food.count++;
        }
        this.$emit('add', event.target);  //接受父组件传过来的事件
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
     font-size:0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave
        opacity: 0
        transform: translate3d(24px, 0, 0) //translate3d(x,y,z)
        .inner
          transform: rotate(180deg)
     .cart-count
       display:inline-block
       vertical-align:top
       width:12px
       padding-top:6px
       line-height:24px
       text-align:center
       font-size:10px
       color:rgb(147,153,159)
     .cart-add
       display:inline-block
       line-height:24px
       font-size:24px
       color:rgb(0,160,220)
</style>