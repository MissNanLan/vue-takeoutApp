<template>
  <div id="app">
    <v-header :seller="seller">

    </v-header>
      <div class="tab">
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
  </div>
</template>

<script type="text/ecmascript-6">
    import {urlParse} from './common/js/util.js'
    import header from './components/header/header'
    const ERR_OK = 0;
    export default{
        data() {
          return{
            seller:{
              id:(() =>{
                let queryParam = urlParse();
                console.log(queryParam);
                return queryParam.id
              })
            }
          };
        },
        created() { //实例化创建完成之后的钩子函数
          this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
            response = response.body; //response.body返回一个对象
             if (response.errno === ERR_OK) {
              this.seller = Object.assign({}, this.seller, response.data);
            }
          });
        },
         components:{
          "v-header":header
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import './common/stylus/mixin.styl'
#app
    .tab
      display:flex
      width:100%
      height:40px
      line-height:40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:1
        text-align:center
        &>a
          display:block
          font-size:14px
          &.myactive
              color:rgb(240,20,20)

</style>
