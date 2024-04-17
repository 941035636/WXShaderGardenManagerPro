<template>
  <div id="NonCoinsurance">
    <div class="top">
      <item-wrapper-item class="dialog-item" :title="'示范项目'">
        <fragment>
          <div class="situation" style="margin-top: 20px">
            <div>
              <h1>560</h1>
              <h3>应保企业（家）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>已保企业（家）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>保额（亿元）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>保费（万元）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>报案数（起）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>赔付金额（万元）</h3>
            </div>
          </div>
        </fragment>
      </item-wrapper-item>
      <item-wrapper-item class="dialog-item" :title="'示范项目'">
        <fragment>
          <div class="situation" style="margin-top: 20px">
            <div>
              <h1>560</h1>
              <h3>应保企业（家）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>已保企业（家）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>保额（亿元）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>保费（万元）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>报案数（起）</h3>
            </div>
            <div>
              <h1>560</h1>
              <h3>赔付金额（万元）</h3>
            </div>
          </div>
        </fragment>
      </item-wrapper-item>
    </div>
    <div style="height: 262px; margin-top: 20px">
      <base-line
        :x-axis-titles="nonCoinsurance.xAxisTitles"
        :data-list="nonCoinsurance.dataList"
      ></base-line>
      <!-- <insured-number></insured-number> -->
    </div>
  </div>
</template>

<script>
  // import itemWrapperItem from '../../components/itemWrapperItem.vue'
  import { Fragment } from 'vue-fragment'
  import baseLine from '../../components/echarts/baseLine.vue'
  // import insuredNumber from '../../components/echarts/insuredNumber.vue'
  export default {
    name: 'NonCoinsurance',
    components: {
      itemWrapperItem,
      baseLine,
      Fragment,
      // insuredNumber,
    },
    data() {
      return {
        nonCoinsurance: {
          xAxisTitles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          dataList: [
            1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
          ],
        },
      }
    },
  }
</script>

<style></style>
