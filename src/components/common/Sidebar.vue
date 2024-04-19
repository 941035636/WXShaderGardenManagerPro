
/
*左侧导航菜单组件
* @property { default-active: {string} 当前激活菜单的 index}
* @property { theme	: {String} 主题色 }
* @property { unique-opened	: {boolean} 是否只保持一个子菜单的展开 }
* @property { router : {boolean} 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 }
* @version 1.0.0
* @edit: quweina
*/
<template>
  <div>
    <div class="sidebar" id="sidebar">
      <!-- <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
				<template v-for="item in list">
					<template v-if="item.subs">
						<el-submenu :index="item.index">
							<template slot="title"><i :class="item.icon" style="font-size:14px;"></i>{{ item.title}}</template>
							<el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
							</el-menu-item>
						</el-submenu>
					</template>
					<template v-else>
						<el-menu-item :index="item.index">
							<i :class="item.icon" style="font-size:14px;"></i>{{ item.title }}
						</el-menu-item>
					</template>
				</template>
			</el-menu> -->

      <div class="sidebar-con">
        <div class="sidebar-left">
          <div
            v-for="(item, key) in list"
            :key="key"
            :class="{
              'sidebar-left-div': true,
              'sidebar-left-div-color': index == item.index,
            }"
            @click="checkTab(item.subs, item.index, item.title)"
          >
            <el-tooltip
              :content="item.title"
              placement="right"
              effect="dark"
              class="el-tooltip-new"
            >
              <div>
                <i
                  :class="item.icon"
                  class="icon iconfont"
                  style="font-size: 24px"
                ></i>
                <p class="sidebar-title-a">{{ item.title }}</p>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div class="sidebar-right" v-show="show">
          <div class="sidebar-title">
            <span>{{ title }}</span>
          </div>
          <el-menu
            :default-active="onRoutes"
            class="el-menu-vertical-demo"
            :default-openeds="opened"
          >
            <template v-for="item in subs">
              <template v-if="item.sub">
                <el-submenu
                  :index="item.index"
                  :class="{ 'is-active': subsindex == item.index }"
                >
                  <template slot="title">{{ item.title }}</template>
                  <el-menu-item
                    v-for="(subItem, i) in item.sub"
                    :key="i"
                    :index="subItem.index"
                    @click="handleOpen(subItem, item.index)"
                    :class="{ 'is-active': subindex == subItem.index }"
                    >{{ subItem.title }}</el-menu-item
                  >
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item
                  :index="item.index"
                  @click="handleOpens(item, item.index)"
                  :class="{ 'is-active': subsindex == item.index }"
                >
                  {{ item.title }}
                </el-menu-item>
              </template>
            </template>

      
          </el-menu>


		      <!-- <el-menu router>
              <el-menu-item index="/contractService">/contractService</el-menu-item>
          </el-menu> -->

          <!-- <p><router-link to="/newList">新闻列表</router-link></p> -->
          <!-- <p><router-link to="/serviceBroker">经纪人管理</router-link></p>
					<p><router-link to="/AppointList">预约列表</router-link></p> -->
          <!-- <p><router-link to="/prev/ehrpert">EHR专家库</router-link></p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
 *item字段说明
 * @property { list : {Array} 菜单数据}
 * @property { icon : {String} 菜单对应图标。 }
 * @property { title : {String} 菜单对应名称。 }
 * @property { index : {String} 路由名称，当有子菜单时index是数字字符串 比如'6',当无字符串时index是‘路由名称’ }
 * @property { subs : {Array} 子菜单数据}
 * @version 1.0.0
 * @edit: quweina
 */

export default {
  data() {
    return {
      list: JSON.parse(window.sessionStorage.getItem("navList")),
      subs: JSON.parse(window.sessionStorage.getItem("subs")),
      index: "",
      title: "",
      show: false,
      opened: [],
      subsindex: "",
      subindex: "",

      contractServiceObj: {
        children: [],
        functionCode: "22FC3372034486866019673-",
        functionHierarchy: "/contractService",
        functionName: "续约跟踪表",
        functionType: "M",
        icon: "",
        id: 4558,
        isRootMenu: "N",
        isShow: null,
        sort: 4558,
        superiorMenuCode: "22FC3372034486866019661-",
      },
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  watch: {
    "$route.path": function (newVal, oldVal) {
      if (newVal == "/order/pd") {
        this.handleOpen(
          {
            functionCode: "20FC2218350694283609442",
            index: "/order/pd",
            title: "批单列表",
          },
          "2"
        );
      } else if (
        oldVal == "/ledger/market/brokerage" &&
        (newVal == "/rectifyResult" )
      ) {
        (this.subs = this.list.find((ele) => ele.title == "冲正")
          ? this.list.find((ele) => ele.title == "冲正").subs
          : {}),
          (this.index = "3");
        this.subsindex = "/reverse";
        let obj = {
          index1: "3",
          index2: "/reverse",
          index3: "",
          value1: "冲正",
          value2: "冲正列表",
          value3: "",
        };
        window.sessionStorage.setItem("luyou", JSON.stringify(obj));
        this.$parent.changeRoutes();
      } 
      else if (
        oldVal == "/ledger/market/brokerage" &&
        (newVal == "/rectifyApplication")
      ) {
        (this.subs = this.list.find((ele) => ele.index == "0")
          ? this.list.find((ele) => ele.index == "0").subs
          : {}),
          (this.index = "0");
        this.subsindex = "2";
        this.subindex  = "/reverse";
        this.title = "保险";
        let obj = {
          index1: "2",
          index2: "2",
          index3: "/reverse",
          value1: "保险",
          value2: "保险服务",
          value3: "冲正管理",
        };
        window.sessionStorage.setItem("luyou", JSON.stringify(obj));
        this.$parent.changeRoutes();
      }
    },
  },
  created() {
    this.setData();
    console.log(
      "navList",
      JSON.parse(window.sessionStorage.getItem("navList"))
    );
  },
  methods: {
    setData() {
      // 处理数据
      let data = JSON.parse(window.sessionStorage.getItem("luyou"));

      this.subsindex = data.index2;
      this.subindex = data.index3;
      this.list.find((item) => {
        console.log(item.index, data.index1);
        if (item.index == data.index1) {
          if (item.subs) {
            item.subs.forEach((ele) => {
              if (Number(ele.index) + 1) {
                this.opened.push(String(ele.index));
              }
            });
            this.subs = item.subs;
            this.show = true;
          } else {
            this.show = false;
          }
        }
      });
      this.index = data.index1;
      this.title = data.value1;
    },
    checkTab(v, i, t) {
      let data = {
        value1: t,
        index1: i,
        value2: "",
        index2: "",
        value3: "",
        index3: "",
      };
      if (!v) {
        this.show = false;
        this.$router.push({
          path: i,
        });
      } else {
        this.subs = v;
        data.value2 = v[0].title;
        data.index2 = v[0].index;
        this.opened = [];
        this.show = true;
        v.forEach((item, index) => {
          if (Number(item.index) + 1) {
            this.opened.push(item.index);
          }
        });
        if (v[0].sub) {
          data.value3 = v[0].sub[0].title;
          data.index3 = v[0].sub[0].index;
          this.$router.push({
            path: v[0].sub[0].index,
          });
        } else {
          this.$router.push({
            path: v[0].index,
          });
        }
      }
      this.title = t;
      this.index = i;
      this.subsindex = data.index2;
      this.subindex = data.index3;
      window.sessionStorage.setItem("luyou", JSON.stringify(data));
      this.$parent.changeRoutes();
    },
    handleOpen(subItem, i) {
      let openList = ["/elevatorBusiness"];
      if (openList.indexOf(subItem.index) !== -1) {
        const { href } = this.$router.resolve({ path: subItem.index });
        window.open(href, "_blank");
      } else {
        let data = {
          value1: this.title,
          index1: this.index,
          value2: "",
          index2: i,
          value3: subItem.title,
          index3: subItem.index,
        };
        this.list.find((item) => {
          if (item.index == this.index) {
            item.subs.find((ele) => {
              if (ele.index == i) {
                data.value2 = ele.title;
              }
            });
          }
        });
        this.subsindex = data.index2;
        this.subindex = data.index3;
        window.sessionStorage.setItem("luyou", JSON.stringify(data));
        this.$parent.changeRoutes();
        this.$router.push({ path: subItem.index });
      }
      console.log(this.subindex);
    },
    handleOpens(item, i) {
      let data = {
        value1: this.title,
        index1: this.index,
        value2: item.title,
        index2: i,
        value3: "",
        index3: "",
      };
      this.subsindex = data.index2;
      this.subindex = data.index3;
      window.sessionStorage.setItem("luyou", JSON.stringify(data));
      this.$router.push({ path: item.index });
      this.$parent.changeRoutes();
      this.$router.push({ path: item.index });
    },
  },
};
</script>



<style lang='less'>
@import "../../assets/styles/public.less";
.listbutton1 {
  position: absolute;
  width: 18px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  left: 0;
  top: 50%;
  margin-top: -20px;
}
.listbutton {
  width: 18px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -20px;
}
.el-icon-arrow-left,
.el-icon-arrow-right {
  font-size: 18px;
}
.sidebar > ul {
  min-height: 100%;
}
// #sidebar {
// 	width: 200px;
// 	height: 100%;
// 	background: #2E363F;
// 	overflow: scroll;
// 	.el-menu {
// 		background-color: #21233d;
// 		border: 0;
// 		color: #fff;
// 		margin-top: -2px;
// 		.icon-shiguyufangshezhi {
// 			font-size: 20px;
// 		}

// 		.icon-baodanguanli1 {
// 			font-size: 18px;
// 		}

// 		.icon-baoansuopeiguanli1 {
// 			font-size: 20px;
// 		}

// 		.icon-yonghuguanli1 {
// 			font-size: 19px;
// 		}
// 	}
// 	.el-submenu__title{
// 		color: #fff;
// 	}
// 	.el-menu-item{
// 		color:#fff;
// 	}
// 	.el-menu .is-active {
// 		background-color: #17182e;
// 	}
// 	.el-submenu .el-menu-item {
// 		text-indent: 20px;
// 		padding: 0 30px!important;
// 	}
// 	.el-submenu__title:hover {
// 		background-color: #17182e;
// 	}
// 	.el-menu-item:hover, .el-menu-item:focus {
// 		background-color: #17182e;
// 	}
// }

.sidebar {
  display: block;
  // position: absolute;
  left: 0;
  // top: 56px;
  bottom: 0;
  background: #fafafa;
  height: 100%;
  .sidebar-con {
    display: flex;
    flex: row;
    height: 100%;
    .sidebar-left {
      width: 57px;
      overflow: auto;
      border-right: 1px solid #f2f2f2;
      padding-top: 5px;
      box-sizing: border-box;
      background-color: #ffffff;
      padding-bottom: 50px;
      .sidebar-left-div {
        position: relative;
        width: 100%;
        height: 60px;
        text-align: center;
        line-height: 40px;
        margin-bottom: 10px;
        cursor: pointer;
        .sidebar-title-a {
          position: absolute;
          top: 22px;
          left: 50%;
          height: 20px;
          width: 40px;
          margin-left: -20px;
        }
        .el-tooltip-new {
          height: 60px;
        }
      }
      .sidebar-left-div-color {
        background-color: #2f2d2d;
        i {
          font-size: 26px;
          color: #fecf84;
        }
        .sidebar-title-a {
          color: #ffffff;
        }
      }
    }
    .sidebar-right {
      width: 171px;
      height: 100%;
      border-right: 1px solid #f2f2f2;
      box-sizing: border-box;
      .sidebar-title {
        width: 170px;
        height: 50px;
        color: #666666;
        font-size: 18px;
        font-weight: 600;
        line-height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
      }
      .el-menu {
        border: 0;
        color: #666666;
        background-color: #fafafa;
      }
      .el-submenu__title {
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        padding: 0 0 0 20px !important;
        box-sizing: border-box;
      }
      .el-menu-item {
        font-size: 14px;
        color: #666666;
        font-weight: 600;
        padding: 0 0 0 20px !important;
        box-sizing: border-box;
      }
      .is-active {
        .el-submenu__title {
          color: #b3781d;
        }
        .el-menu .is-active {
          color: #b3781d;
          background-color: #f7eee1;
          font-weight: 700;
        }
      }
      .el-menu > .is-active {
        color: #b3781d;
      }
      .el-submenu .el-menu-item {
        font-size: 14px;
        color: #898989;
        font-weight: normal;
        padding: 0 0 0 20px !important;
        box-sizing: border-box;
        min-width: 130px !important;
        height: 32px;
        line-height: 32px;
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 20px;
        margin-bottom: 8px;
      }
      .el-submenu__title:hover {
        background-color: #f7eee1;
      }
      .el-menu-item:hover,
      .el-menu-item:focus {
        background-color: #f7eee1;
      }
    }
  }
}
</style>
