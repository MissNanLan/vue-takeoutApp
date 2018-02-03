## 先看效果
![商品页.jpg](http://upload-images.jianshu.io/upload_images/4092152-9b4ec1c5a4af571e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![商家页jpg](http://upload-images.jianshu.io/upload_images/4092152-2211a3ad2b2216fe.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![购物车.jpg](http://upload-images.jianshu.io/upload_images/4092152-a060664290262548.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![评论页jpg](http://upload-images.jianshu.io/upload_images/4092152-cbb63e4a988060fb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![公告页S80202-230340.jpg](http://upload-images.jianshu.io/upload_images/4092152-f61bccefca6433c0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 路由配置main.js
记得要引入各个组件
```
const  router = new VueRouter({
mode:"hash",
linkActiveClass:"myactive",//设置高亮显示。myactive的样式在app.vue当中设置
routes:[
 {path:'/',redirect:'goods'},  //设置默认的页面
 { path:'/goods',
    component:goods
  },
  { path :'/ratings',
    component:ratings
  },
  { path:'/seller',
    component:seller
  }
]
}) 
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```
2、App.vue
```
 <div class="tab border-1px">
        <div class="tab-item">
         <router-link to="/goods" activeClass="myactive" >商品</router-link>
        </div>
          <div class="tab-item">
         <router-link to="/ratings">评论</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/seller" >商家</router-link>
          </div>
        </div>
        <!--keep-alive只让页面请求一次-->
        <router-view :seller="seller" keep-alive></router-view>
```
myactive在style里面设置高亮显示的样式
## 设置数据来源
要安装vue-resource
在build的webpack.dev.conf.js的文件里面配置路由代理
```var express = require('express')  //加载express框架
const app = express()
var appData = require('../data.json') //设置数据来源
var seller = appData.seller; 
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router();
app.use('/api',apiRoutes);
```
```
    //配置路由代理
    before(app){
      app.get('/api/seller',(req,res)=>{
        res.json({
          errno:0,
          data:seller
        })
      }),
          app.get('/api/goods',(req,res)=>{
            res.json({
              errno:0,
              data:goods
            })
          }),
          app.get('/api/ratings',(req,res)=>{
            res.json({
              errno:0,
              data:ratings
            })
          })
    }
  },
```
![配置成功的效果.png](http://upload-images.jianshu.io/upload_images/4092152-a54d3e5ea9a68c6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
####图标图片的自适应
![就是这样的图标.png](http://upload-images.jianshu.io/upload_images/4092152-203496a41045fc12.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里用的是stylus，stylus功能强大，可以写成函数等等。这里可以参考[张鑫旭的博客](http://www.zhangxinxu.com/jq/stylus/)
1、定义
![image.png](http://upload-images.jianshu.io/upload_images/4092152-934e3532932482aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](http://upload-images.jianshu.io/upload_images/4092152-5a41c44446d6f69b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
关于更多[设备像素比的知识可点击这里devicePixeRatio](http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)
2、引用
![image.png](http://upload-images.jianshu.io/upload_images/4092152-388ea505a18c7120.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 字体图标的使用
这里用的是iconmoon，就是将svg的文件上传到iconmoon做成字体图标文件。
![svg文件.png](http://upload-images.jianshu.io/upload_images/4092152-20baa82496957a6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用方法
```
    <i class="icon icon-keyboard_arrow_right"></i>
```
## 当页面超出时出现滚动效果（左侧菜单和右侧区域都要独立滚动）
```
    _initScroll() {
           this.meunScroll = new BScroll(this.$refs.menuWrapper, {
             click:true  //这里设置为click等于true的原因是因为BScroll阻止了点击事件
           });
           this.foodScroll = new BScroll(this.$refs.foodWrapper, {
               probeType: 3,
               click:true
          });
```
这里用的BScroll插件。安装命令是 cnpm install --save-dev better-scroll，然后在要使用的组件中引入即可
####联动和选择效果
联动效果，即右侧区域滚动到某个分类块其左侧菜单也要高亮显示
首先我们想下逻辑。是不是要知道右侧区域的内容每个分类块的高度，当右侧内容列表的内容和和左侧菜单列表的下标值相等的时候，左侧菜单列表高亮显示。
算出高度
#####联动
```
  _calculateHeight(){ //获取foodList的高度
            let foodList = this.$refs.foodList;  //拿到foodlist
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
              let item = foodList[i];
              height += item.clientHeight; //clientHeight是可见区域的高度
              this.listHeight.push(height);
             }
           }
```
```
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
```
监听右侧区域滚动事件
```
  //监听右侧区域的滚动事件
           this.foodScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
            }
         });
```
高亮显示
```
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
```
```
 _followScroll(index) {
              let menuList = this.$refs.menuList;
              let el = menuList[index];
              this.meunScroll.scrollToElement(el, 300, 0, -100); 
              //scrollToElement(el, time, offsetX, offsetY, easing)
            }
```
![image.png](http://upload-images.jianshu.io/upload_images/4092152-961da42ab2fdb0af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
条件成立时给它加上高亮显示的样式
## 选择
```
     selectMenu(index,event) {
          if (!event._constructed) {  //这里会触发两次事件，浏览器原生事件和自己派发事件。如果不穿$event进来的话，那么就会打印两次
            return;                  //这里是把原生的事件给return掉
          }
          let foodList = this.$refs.foodList;
          let el = foodList[index];
          this.foodScroll.scrollToElement(el, 300);//300是滚动的时间
        }
```
在左侧菜单点击触发

####父组件goods项子组件传选中的商品
food子组件和shopcart，还有cartcontrol组件都会接收父组件goods传过来的值
```
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
```
## 购物车小球动画
```
 beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //getBoundingClientRect用于获取某个元素相对于视窗的位置集合
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;//y轴转
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`; //x轴转
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
```
调用
```
<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
```
####星级评分
这里的星级评分的逻辑还算比较简单。它接受父组件传来的两个参数，一个是星星的大小，一个是分数。
```
     props:{
            size:{
                type:Number
            },
            score:{
                type:Number
            }
        }
```
关键代码：怎么显示全星、半星、空星
```
 itemClasses() {
                let result = [];  //math.floor()对数字进行下舍入
                let score = Math.floor(this.score*2) / 2;
                let hasDecimal = score%1 !=0;  //余数为0的话就不是小数
                let integer = Math.floor(score);
                for(let i =0; i<integer;i++){
                    result.push(CLS_ON);
                }
                if(hasDecimal){
                    result.push(CLS_HALF);
                }
                while(result.length<LENGTH){
                    result.push(CLS_OFF);
                }
                return result;
            }
```

## flex布局实现左侧固定右侧自适应
html代码
```
<div class="goods">
<div class="menu-wrapper"></div>
<div class="foods-wrapper"></div>
</div>
```
stylus代码
```
.goods
  display:flex
  .menu-wrapper
     flex:0 0 100px;
     width:100px
  .foods-wrapper
     flex:1
```
这样就实现了左侧固定右侧区域自适应
## 水平方向滚动
```
   _initScroll(){
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.seller,{
            click:true
          });
        }else{
          this.scroll.refresh();
        }
      }
```
![商家实景水平滚动.png](http://upload-images.jianshu.io/upload_images/4092152-e97ff119359fb70e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 打包编译
```
node build  //会生成dist文件夹
```
![dist文件夹.png](http://upload-images.jianshu.io/upload_images/4092152-95295419068f7ba3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以建一个小型的prod.server.js
在手机访问输入自己的ip加端口号，如果不能访问的话，在config文件夹下的index.js文件里面的dev将host改为0.0.0.0，在电脑端用localhost加端口访问
![.png](http://upload-images.jianshu.io/upload_images/4092152-663930f0976c75d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


个人总结：一路走来，确实遇到不少的困难，是因为老师的教学视频是1.0的,而现在vue都升级2.x了。所以在这个过程中难眠会遇到一些困难，我记得第一次接触这个视频，因为版本不对，自己就放弃了，但是后来又重新打开来看，加深对vue的认识

主要有建立数据mocks、路由配置（哈希路由和历史路由、高亮显示、配置默认页面）、字体图标（svg文件编程字体文件，iconmoon）、图标图标做自适应（主要使用媒体查询）、stylus实战（主要是stylus可以写成函数的形式，方便于整合样式代码）、flex布局、父子组件传递数据、Bscroll插件的使用（当移动端的内容超出时滚动、水平也是）、vue的过渡等等
