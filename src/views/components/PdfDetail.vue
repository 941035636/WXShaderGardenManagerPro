<template>
    <div class="all">
        <header>
            <div class="newbankcard">
                <span class="pf_thick">{{name}}</span>
                <span class="fr f20 mr20 col-blue" @click="downFile"> <i class="el-icon-download"></i>下载</span>
            </div>
        </header>
        <div class="main-content">
            <pdf :src="src" :page="currentPage" @progress="loadedRatio = $event" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler" ref="wrapper" class="pdf"></pdf>
        </div>
        <div class="option-btn f20">
            <span @click="scaleD"><i class="el-icon-zoom-in"></i></span>
            <span @click="scaleX"><i class="el-icon-zoom-out"></i></span>
            <span class="f16" @click="changePdfPage(0)">上一页</span>
            <span class="f16" @click="changePdfPage(1)">下一页</span>
        </div>

    </div>
</template>

<script>
    import pdf from "vue-pdf";
    import ResourcesService from '@/service/ResourcesService'
    export default {
        components: {
            pdf,
        },
        name:"PdfDetail",
        data() {
            return {
                ResourcesService: new ResourcesService(),
                currentPage: 1,
                pageCount: 0,
                src: "", // pdf文件地址
                scale: 70, //放大系数
                clauseTitle: "",
                loadedRatio: 0,
                name:""
            };
        },
        created() {
            // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
            let clause = this.$route.query.fildId;
            this.name = this.$route.query.fildName;
            // this.src = this.$apiUrl.COM_INDENT_SHOW + clause;
            // this.src = pdf.createLoadingTask(this.src)
            this.getFile(clause)
        },
        methods: {
            async getFile(clause){
                // this.src = this.$apiUrl.COM_INDENT_SHOW + clause;
                let {code,url} = await this.ResourcesService.downloadOrViewFile(clause,false)
                this.src = pdf.createLoadingTask(url)
            },
            // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
            changePdfPage(val) {
                if(val === 0 && this.currentPage > 1) {
                    this.currentPage--;
                }
                if(val === 1 && this.currentPage < this.pageCount) {
                    this.currentPage++;
                }
            },
            // pdf加载时
            loadPdfHandler(e) {
                this.currentPage = 1; // 加载的时候先加载第一页
                this.scale += -5;
                this.$refs.wrapper.$el.style.width = parseInt(this.scale) + "%";
            },
            //放大
            scaleD() {
                this.scale += 5;
                this.$refs.wrapper.$el.style.width = parseInt(this.scale) + "%";
            },

            //缩小
            scaleX() {
                if(this.scale == 100) {
                    return;
                }
                this.scale += -5;
                this.$refs.wrapper.$el.style.width = parseInt(this.scale) + "%";
            },
            downFile() {
                let clause = this.$route.query.fildId;
                this.ResourcesService.downloadOrViewFile(clause,true)
            }
        },
    };
</script>
<style lang="less" scoped>
    .all {
        max-height: 100%;
        overflow: scroll;
        padding: 0 0 rem(80);
        header {
            height: rem(88);
            position: sticky;
            top: 0;
            background-color: #fff;
            width: 100%;
            z-index: 400;
            .sprites_all {
                position: absolute;
                left: rem(30);
                top: rem(24);
                display: inline-block;
                width: rem(40);
                height: rem(40);
                background-size: rem(400);
                vertical-align: bottom;
                background-position: 0 rem(-50);
            }
            .sprites_back {
                background-position: rem(-50) 0;
            }
            span {
                line-height: rem(86);
                font-size: rem(30);
            }
            border-bottom: 1px solid #ccc;
            .newbankcard {
                text-align: center;
                height: 60px;
                line-height: 60px;
                font-size: 30px;
                border-bottom: 1px solid #ccc;
                .col-blue {
                    color: #3a3af7;
                    cursor: pointer;
                }
            }
        }
        .main-content {
            overflow: auto !important;
            width: 80%;
            margin-left:10%;
        }
        .option-btn {
            position: fixed;
            bottom: 40%;
            right: 5%;
            cursor: pointer;
            span {
                display: block;
                width: 60px;
                height: 60px;
                line-height: 60px;
                text-align: center;
            }
        }
    }
</style>