<template>
<div>
   <div class="goods">
        <div class="menu-wrapper"  ref="menuWrapper">
          <ul>
            <li v-for="(item,index) in goods" v-bind:key="item.id" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" ref="menuList">
                                                                                      <!--currentIndex等于index的时候，条件才成立-->
                 <span class="text ">
                     <span v-show="item.type>0" class="icon"  :class="classMap1[item.type]">  </span>
                         {{item.name}}
                  </span>
            </li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foodWrapper">
          <ul>
            <li  v-for="item in goods" class="food-list" v-bind:key="item.id" ref="foodList">
              <h1 class="title"> {{item.name}} </h1>
              <ul>
                <li @click="selectFood(food,$event)" v-for="food in item.foods" v-bind:key="food.id" class="food-item">
                    <div class="icon">
                       <img :src="food.icon">
                     </div>
                     <div class="content">
                       <h2 class="name">{{food.name}}</h2>
                       <p class="desc">{{food.description}}</p>
                       <div class="extra">
                         <span>月售{{food.sellCount}}份</span>
                         <span>好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                          <span class="now">￥{{food.price}}</span>
                          <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>    
                        </div>
                        <div class="cartcontrol-wrapper">
                             <cartcontrol @add="addFood" :food="food"></cartcontrol>
                        </div>
                      </div>
                  </li>
               </ul>
             </li>
          </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
   </div>
    <food @add="addFood" :food="selectedFood" ref="food"></food>      <!-- :food是子组件接收父组件传过来的参数-->
    </div>

</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';
import Vue from 'vue'
 const eventHub = new Vue()
 const ERR_OK = 0;
     export default{
       props:{
         seller:{
            type:Object
         }
       },
        data() {
          return{
            goods:[],
            listHeight:[],
            scrollY:0,
            selectedFood:{}
          };
        },
        computed:{
           currentIndex() {
              for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                  this._followScroll(i);
                  return i;
                }
              }
              return 0;
        },
          //在goods组件里面选了多少foods
         selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                if (food.count) {
                  foods.push(food);
                }
              });
            });
            return foods;
         }
     },
        created() { //实例化创建完成之后的钩子函数
          this.classMap1 = ['decrease','discount','special','guarantee','invoice'];
          this.$http.get('/api/goods').then((response) => {
            response = response.body; //response.body返回一个对象
            if(response.errno === ERR_OK){
              this.goods = response.data;
              this.$nextTick(() => {  //this.$nextTick是在下次DOM更新循环结束时调用延迟回调函数。
                   this._initScroll();
                   this._calculateHeight();
              })
            }
          });
        },
        //vue有个不成文的规矩，以下划线开头的方法在当前文件内调用，没有带下划线的方法可以被外部调用
        methods:{
          //选择菜单
        selectMenu(index,event) {
          if (!event._constructed) {  //这里会触发两次事件，浏览器原生事件和自己派发事件。如果不穿$event进来的话，那么就会打印两次
            return;                  //这里是把原生的事件给return掉
          }
          let foodList = this.$refs.foodList;
          let el = foodList[index];
          this.foodScroll.scrollToElement(el, 300);//300是滚动的时间
        },
        //选择商品 
        selectFood(food,event){
          this.selectedFood = food ;
          this.$refs.food.show();  //调用food子组件的方法
        },
       addFood(target) {
        this._drop(target);
      },
          _drop(target) {
          // 体验优化,异步执行下落动画
          this.$nextTick(() => {
             this.$refs.shopcart.drop(target);//通过this.$refs.shortcart访问到子组件,调用它的drop方法同时把它的子组件传进去
            });//这里调用到了子组件的方法，神奇
          },
         _initScroll() {
           this.meunScroll = new BScroll(this.$refs.menuWrapper, {
             click:true  //这里设置为click等于true的原因是因为BScroll阻止了点击事件
           });
           this.foodScroll = new BScroll(this.$refs.foodWrapper, {
               probeType: 3,
               click:true
          });
          //监听右侧区域的滚动事件
           this.foodScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
            }
         });
      },
           _calculateHeight(){ //获取foodList的高度
            let foodList = this.$refs.foodList;  //拿到foodlist
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
              let item = foodList[i];
              height += item.clientHeight; //clientHeight是可见区域的高度
              this.listHeight.push(height);
             }
           },
            _followScroll(index) {
              let menuList = this.$refs.menuList;
              let el = menuList[index];
              this.meunScroll.scrollToElement(el, 300, 0, -100); 
              //scrollToElement(el, time, offsetX, offsetY, easing)
            }
        },
        components:{
          shopcart,
          cartcontrol,
          food
        }
     }
  </script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';
   .goods
     display:flex
     position:absolute
     top:174px
     bottom:46px
     width:100%
     overflow:hidden
     height:100%
     .menu-wrapper
       flex:0 0 80px
       width:80px
       background #f3f5f7
       .menu-item
         padding:0 12px
         display:table
         height:54px
         width:56px
         line-height:14px
         &.current
           background-color:red
           z-index:10
           margin-top:-1px
           font-weight:700
           .text
             border-none()
         .icon
            display:inline-block
            width:12px
            height:12px
            margin-right:2px
            vertical-align:top
            background-size:12px 12px
            background-repeat:no-repeat
            &.decrease
                bg-image('decrease_3')
            &.discount
                bg-image('discount_3')
            &.special
                bg-image('special_3')
            &.guarantee
                bg-image('guarantee_3')
            &.invoice
                bg-image('invoice_3')
         .text
              display:table-cell
              width:56px
              vertical-align:middle
              border-1px(rgba(7,17,27,0.1))
              font-size:12px
     .foods-wrapper
       flex:1
       .title
          padding-left:14px
          height:26px
          line-height:26px
          border-left:2px solid #d9dde1
          font-size:12px
          color:rgb(147,153,159)
          background:#f3f5f7
      .food-item
          display:flex
          margin:18px
          border-1px(rgba(7,17,27,0.1))
          padding-bottom:10px
          &:last-child
            border-none()
            margin-bottom:0
          .icon
            flex:0 0 57px
            margin-right:10px
          .content
            flex:1
            .name
              margin:2px 0 8px 0
              height:14px
              line-height:14px
              color:rgb(7,17,27)
            .desc,.extra
              line-height:12px
              font-size:10px
              color:rgb(147,153,159)
            .desc
              margin-bottom:8px
            .extra
              &.count
                margin-right:12px
            .price
              font-weight:700
              line-height:24px
            .cartcontrol-wrapper
              position:absolute
              right:0
              bottom:12px
            .now
               margin-right:8px
               font-size:14px
               color:rgb(240,20,20)
               font-weight:bold
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
</style>