<template>
  <div class="ratingselect">
      <div class="rating-type">
          <!--此处的active属性存在与否存在与否将取决于selectType-->
          <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}     
                <span class="count">{{ratings.length}}</span>
          </span>
          <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}  
              <span class="count">{{positives.length}}</span>
          </span>
          <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}  
              <span class="count">{{negatives.length}}</span>
          </span>
      </div>
      <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
      </div>
  </div>  
</template>
<script class="text/ecmascript-8">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
      props:{
          //从父组件ratings接收ratings数组
          ratings:{
              type:Array,
              default(){
                  return [];
              }
          },
          selectType:{
              type:Number,
              default:ALL
          },
          onlyContent:{
              type:Boolean,
              default:false
          },
          desc:{
              type:Object,
              default(){
                  return {
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                  };
              }
          }
      },
      computed:{
          //在data的ratings的rateType字段当中，0表示满意，1表示不满意，这里POSITIVE和NEGATIVE是个标志位
          positives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE; //positvies.length可以求出满意的数目
            });
        },
        negatives() {
            return this.ratings.filter((rating) => { //positvies.length可以求出不满意的数目
                return rating.rateType === NEGATIVE;
            });
         }
      },
      methods:{
          //切换高亮显示的样式
          select(type,event){
              if(!event._constructed){
                  return ;
              }
              this.selectType = type; //type传的是选项的类型
              this.$emit('select', type);
          },
          toggleContent(event) {
            if (!event._constructed) {
                return;
            }
            this.onlyContent = !this.onlyContent;
            this.$emit('toggle');
            }
      }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .ratingselect
    .rating-type
       padding:18px 0
       margin:0 18px
       border-1px(rgba(7,17,27,0.1))
       font-size:0
       .block
          display:inline-block
          padding:8px 12px
          margin-right:8px
          line-height:16px
          border-radius:2px
          font-size:12px
          color:rgb(77,85,93)
          &.active
            color: #fff
          .count
            margin-left: 2px
            font-size: 8px
          &.positive
             background: rgba(0, 160, 220, 0.2) 
             &.active
               background: rgb(0, 160, 220)
          &.negative
             background: rgba(77, 85, 93, 0.2)
             &.active
               background: rgb(77, 85, 93)
     .switch
        padding:12px 18px
        line-height:24px
        border-bottom:1px solid rgba(7,17,27,0.1)
        color:rgb(147,153,159)
        font-size:0
        &.on
         .icon-check_circle
           color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px


</style>