<template>
 <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image"> <!--food是父组件goods传过来的数组，表示当前点击的选项-->
                <div class="back" @click="hide">
                   <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                  <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                   
                  <div class="cartcontrol-wrapper">
                       <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                <transition name="fade">
                    <!--  !food.count表示没有这个组件-->
                    <div @click="addFirst" class="buy" v-show="!food.count ||food.count==0">
                       加入购物车
                   </div>
               </transition>
            </div>
            <split></split>
            <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
            </div>
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect @select="selectRating" :selectType="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" v-bind:key="rating.id" class="rating-item">
                           <div class="user">
                               <span class="name">{{rating.username}}</span>
                               <img class="avatar" width="12" height="12" :src="rating.avatar">
                           </div>
                           <div class="time">{{rating.rateTime | formatDate}}</div>
                           <p class="text">
                               <span :class="{'icon-thumb_up':rating.rateType==0,'icon-thumb_down':rating.rateType===1}">{{rating.text}}</span>
                           </p>
                        </li>
                    </ul>
                    <!-- 如果商品没有评论，就显示暂无评价的提示信息 -->
                     <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
       </div>
    </div>
 </transition>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import ratingselect from '../ratingselect/ratingselect';
import split from '../split/split';
import { formatDate } from "../../common/js/date.js"
import Vue from 'vue';
//加花括号的原因是因为date里面export的是funtion，不是export default
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
 export default {
    props:{
            food:{
                type:Object //接收父组件goods传过来的food数组
            }
        },
    data(){
         return{
             showFlag:false,
             selectType:ALL,
             onlyContent:true,
             desc:{
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
             }
           }
        },
        methods:{
            show(){
                this.showFlag = true;
                this.selectType = POSITIVE;
                //onlyContent表示是否显示内容
                this.onlyContent = true;
                this.$nextTick(() =>{
                 if(!this.scroll){
                     this.scroll = new BScroll(this.$refs.food,{
                         click:true
                     });
                 }else{
                     this.scroll.refresh();
                 }
              })
            },
            hide(){
                this.showFlag = false
            },
            addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                this.$emit('add', event.target);
                Vue.set(this.food, 'count', 1);
            },
            needShow(type,text){
                if(this.onlyContent && !text){
                      return false;
                }
                if(this.selectType === ALL){
                    return true;
                }else{
                    return type === this.selectType;
                }
            },
            addFood(target) {
                  this.$emit('add', target);
           },
            selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
       filters: {
        formatDate(time) {
            let date = new Date(time);
              return formatDate(date, 'yyyy-MM-dd hh:mm');  
            }
          },
        components:{
            cartcontrol,
            ratingselect,
            split
        }
    };
    /*stylus里面有括号还会报错哦*/
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
 .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
      .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        .now
          margin-right: 8px
          font-weight:bold
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 10px
        bottom: 10px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)

</style>
