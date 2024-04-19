<template>
	<div class="electroniCvouchers" id="electroniCvouchers">
		<div class="content1" >
			<div class="content1-box-title">
				<span v-if="$route.query.index == '5'">订单列表/物业项目清单</span>
				<span v-else-if="$route.query.index == '8'">订单列表/设备清单</span>
				<span  v-else>订单列表/人员清单</span>
			</div>
			<div class="content1-box-order" @click="bonbackDetails">
				返回订单详情
			</div>
			<div class="content1-box-return" @click="bonback">
				返回
			</div>
		</div>
		<div class="policy-details" >
			<el-row class="f16">
				<el-col :span="8">
					<span>投保人：</span>
					<span style="color:#0F54A9" v-if="data.holder && data.holder.corporation">{{data.holder.corporation.name}}</span>
				</el-col>
				<el-col :span="8">
					<span>保单号：</span>
					<span>{{data.policyNo || '-'}}</span>
				</el-col>
				<el-col :span="8">
					<span>保单状态：</span>
					<span :style="{'color':data.orderStatusColor}">{{data.orderStatusName}}</span>
				</el-col>
			</el-row>
		</div>
		<div class="content-table">
			<div class="content-table-title">
				<div class="content-table-title-l">
					<el-row>
						<span>数据筛选：</span>
						<el-button class="mr10 w80" :type="buttonFlag=='ys'?'warning':''" size="medium" round @click="setChangeData('ys')">原始数据</el-button>
						<el-button v-if="data.policyNo" class="mr10 w80" :type="buttonFlag=='zz'?'warning':''" size="medium" round @click="setChangeData('zz')">最终在保</el-button>
					</el-row>
				</div>
				<div class="content-table-title-r">
					<el-button  v-show="datas.find(item => item.key == '00000') && (($route.query.index == '1' && buttonFlag=='ys') || (($route.query.index == '1' || $route.query.index == '2'|| $route.query.index == '5') && buttonFlag=='zz') )" type="primary" round @click="exports"> 导出</el-button>
				</div>
			</div>
			<!-- <div class="content3">
				<span class="item7" v-if="datas.find(item => item.key == '100001') && $route.query.productCode == '19PR695659' && $route.query.applicationStatus == '08'" @click="redirectURL('/addExtends',$route.query.appCode,$route.query.productCode)">追加</span>
				<span class="item7" @click="bonback">返回</span>
				<span class="content1-exports"  @click="exports" v-if="datas.find(item => item.key == '00000') && $route.query.index == '1'"><img src="../../../static/img/dus.png" alt="">导出</span>
			</div> -->
			<div class="data-form" v-if="buttonFlag=='ys'">
				<el-table :data="data1"  fit style="width:100%;" highlight-current-row show-header v-if="$route.query.index == '1'" :header-cell-style="getRowClass1" border>
					<el-table-column  type="index" label="序号" width="60" align="center"></el-table-column>
					<el-table-column prop="appFormCode" label="电梯信息" width="375">
						<template slot-scope="scope">
							<div class="data-item">
								<p class="color-gray-6 f14 lh30">
									<span style="color:#0F54A9">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000018')?(scope.row.extendsList.find(item => item.fieldCode == 'S_O_000018').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000018').fieldValues:'无'):'无'}}</span>
								</p>
								<p class="color-gray-6 f14 lh30">
									<span class="color-gray-0">坐落地址：</span>
									<span class="color-gray-0">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000017')?(scope.row.extendsList.find(item => item.fieldCode == 'S_O_000017').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000017').fieldValues:'无'):'无'}}</span>
								</p>
								<p class="color-gray-6 f14 lh30">
									<span class="color-gray-0">使用场所：</span>
									<span class="color-gray-0">{{scope.row.names?scope.row.names:'无'}}</span>
								</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="设备(出厂)编号" align="center" width="300">
						<template slot-scope="scope">
							<span class="color-gray-0">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000013').fieldValues:scope.row.extendsList.find(item => item.fieldCode == 'S_O_000012').fieldValues}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="年限/载重/高度" align="center" width="300">
						<template slot-scope="scope">
							<p class="color-gray-0 f14 lh30">
								<span style="color:#096DD9" v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000002') && scope.row.extendsList.find(item => item.fieldCode == 'S_O_000002').fieldValues">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000002').fieldValues}}  <span style="color:#00">年</span></span>
								<span v-else>无</span>
							</p>
							<p class="color-gray-0 f14 lh30">
								<span v-if="scope.row.name"><span v-if="scope.row.name">{{scope.row.name}}</span><span v-else>无</span></span>
								<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000044') && scope.row.extendsList.find(item => item.fieldCode == 'S_O_000044').fieldValues">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000044').fieldValues}}m</span>
								<span v-else-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000043') && scope.row.extendsList.find(item => item.fieldCode == 'S_O_000043').fieldValues">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000043').fieldValues}}KG</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保险期间" align="center" width="251">
						<template slot-scope="scope">
							<p class="color-gray-0">{{scope.row.startDate | timer}} 至 {{scope.row.endDate | timer}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保费（元）" width="300">
						<template slot-scope="scope">
							<p><span class="color-gray-0">总保费:</span> <span style="color:#F63842" v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016').fieldValues:'无'}}</span> </p>
							<p><span class="color-gray-0">基本险:</span> <span style="color:#F63842" v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000014')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000014').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000014').fieldValues:'无'}}</span> </p>
							<p><span class="color-gray-0">附加险:</span> <span style="color:#F63842" v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000015')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000015').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000015').fieldValues:'无'}}</span> </p>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" v-if="$route.query.productCode == '19PR861859' && $route.query.applicationStatus == '10'">
						<template slot-scope="scope">
							<span style="cursor: pointer;color:#1E90FF;" class="item11" @click="modify(scope.row)">电子凭证</span>
					</template>
					</el-table-column>
					<el-table-column  label="检验机构" align="center" v-if="$route.query.productCode == $globalProductCode.PRODUCT_CODE_NJ">
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000086')">
								<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000086').fieldValues == '1'">省特检院</span>
								<span  v-else-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000086').fieldValues == '2'">市特检院</span>
							</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '2'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="objectName" label="姓名" align="center"></el-table-column>
					<el-table-column prop="policyHolderName" label="证件类型" v-if="$route.query.productCode != '20PR522603' && $route.query.productCode != '21PR387890'">
						<template slot-scope="scope">
							<p>{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000048').fieldValues}}</p>
							<p>{{scope.row.objectId}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="policyHolderName" label="证件类型" v-if="$route.query.productCode == '21PR387890'">
						<template slot-scope="scope">
							<p>{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000088').fieldValues}}</p>
							<p>{{scope.row.objectId}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="岗位" align="center" v-if="$route.query.productCode != '20PR522603' && $route.query.productCode != '20PR780454' && $route.query.productCode != '20PR360646' && $route.query.productCode != '20PR503531' && $route.query.productCode != '21PR591697' && $route.query.productCode != '21PR387890'">
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000033')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000033').fieldValues}}</span>
							<span v-if="scope.row.etypeName ">{{scope.row.etypeName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="是否有工伤保险" align="center" v-if="$route.query.productCode == '21PR380984'">
						<template slot-scope="scope">
							<span v-if="scope.row.hasInjuryInsurance ">{{scope.row.hasInjuryInsurance}}</span>
						</template>
					</el-table-column>
					<el-table-column  label="保险期间" align="center" width="251">
						<template slot-scope="scope">
							<p>{{scope.row.startDate | timer}} 至 {{scope.row.endDate | timer}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保费（元）" align="center">
						<template slot-scope="scope">
							<p> <span style="color:#F63842" v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016').fieldValues?scope.row.extendsList.find(item => item.fieldCode == 'S_O_000016').fieldValues:'无'}}</span> </p>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '3'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" label="索道名称" align="center" min-width="150"></el-table-column>
					<el-table-column prop="type" label="索道类型" align="center" min-width="150"></el-table-column>
					<el-table-column prop="passengerLastyear" label="上年度运送乘客人次（万）" align="center" min-width="200"></el-table-column>
					<el-table-column prop="state" label="客运索道设备代码" align="center" min-width="200">
						<template slot-scope="scope">
							<span>{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000059').fieldValues}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保险期限" align="center" min-width="160">
						<template>
							<span>{{data.startDate}}<br/>至<br/>{{data.endDate}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="basicpremium" label="基本险保费（元）" align="center" min-width="180"></el-table-column>
					<el-table-column prop="additionalpremium" label="附加险保费（元）" align="center" min-width="180"></el-table-column>
					<el-table-column prop="totalpremium" label="总保费（元）" align="center" min-width="180"></el-table-column>
				</el-table>
				<el-table :data="data2" border fit style="width: 96%" highlight-current-row show-header v-if="$route.query.index == '4'">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" label="姓名" align="center"></el-table-column>
					<el-table-column prop="licenceType" label="证件类型" align="center" min-width="150"></el-table-column>
					<el-table-column prop="licenceNo" label="证件号码" align="center" min-width="200"></el-table-column>
					<el-table-column prop="occupationType" label="职业" align="center"></el-table-column>
					<el-table-column prop="birthday" label="出生年月" align="center" min-width="120"></el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '5'" :header-cell-style="getRowClass">
						<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
						<el-table-column prop="projectName" label="项目名称" min-width="200">
							<template slot-scope="scope">
								<p>
									<span style="color:#0F54A9">{{scope.row.projectName}}</span>
								</p>
								<p>
									<span>项目地址：</span>
									<span>{{scope.row.province}}</span>
									<span>{{scope.row.city}}</span>
									<span>{{scope.row.county}}</span>
									<span>{{scope.row.address}}</span>
								</p>
								<p>
									<span>项目类型：</span>
									<span>{{scope.row.projectClassName}}</span>
								</p>
							</template>
						</el-table-column>
						<el-table-column prop="areaBuild" label="建筑面积/车位数/游泳池数/电梯数" align="center">
							<template slot-scope="scope">
								<span>{{scope.row.areaBuild}}(平米)</span>
								<span>/{{scope.row.cars}}个</span>
								<span>/{{scope.row.pools}}个</span>
								<span>/{{scope.row.elevatorNum}}个</span>
							</template>
						</el-table-column>
						<!-- <el-table-column prop="cars" label="车位数" align="center"></el-table-column>
						<el-table-column prop="pools" label="游泳池数" align="center" ></el-table-column> -->
						<!-- <el-table-column prop="projectClassName" label="项目类型" align="center"></el-table-column> -->
						<el-table-column prop="state" label="保险期间" align="center" min-width="160">
							<template>
								<span>{{data.startDate | timer}} 至 {{data.endDate | timer}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="riskFree" label="保费" align="center"></el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '6'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="objectName" label="姓名" align="center"></el-table-column>
					<el-table-column prop="policyHolderName" label="证件类型" align="center" >
						<template slot-scope="scope">
							<span v-if="scope.row">身份证</span>
						</template>
					</el-table-column>
					<el-table-column prop="objectId" label="证件号码" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000049')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000049').fieldValues}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="岗位" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000033')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000033').fieldValues}}</span>
							<span v-if="scope.row.etypeName ">{{scope.row.etypeName}}</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="data1" border fit  highlight-current-row show-header v-if="$route.query.index == '7'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="objectName" label="姓名" align="center"></el-table-column>
					<el-table-column label="证件类型" align="center" >
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000048')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000048').fieldValues}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="objectId" label="证件号码" align="center"></el-table-column>
					<el-table-column prop="state" label="投保房屋详细地址" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000082')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000082').fieldValues}}</span>
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000083')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000083').fieldValues}}</span>
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000084')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000084').fieldValues}}</span>
							<span v-if="scope.row.extendsList.find(item => item.fieldCode == 'S_O_000085')">{{scope.row.extendsList.find(item => item.fieldCode == 'S_O_000085').fieldValues}}</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table  :data="data1" border fit  highlight-current-row show-header v-if="$route.query.index == '8'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" label="机械类型" align="center" min-width="150">
						<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000178') | getMechanicsType}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="品牌型号" align="center" min-width="150">
							<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000179')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="passengerLastyear" label="发动机号" align="center" min-width="200">
							<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000109')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="出厂日期" align="center" min-width="200">
						<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000180')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="车牌号" align="center" min-width="100">
						<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000143')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="车辆识别代码" align="center" min-width="160">
						<template slot-scope="scope">
							<span>{{scope.row.extendsList | getFieldValues('S_O_000181')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="basicpremium" label="购置日期" align="center" min-width="180">
							<template slot-scope="scope">
								<span>{{scope.row.extendsList | getFieldValues('S_O_000182')}}</span>
							</template>
					</el-table-column>
					<el-table-column prop="additionalpremium" label="购置金额" align="center" min-width="180">
							<template slot-scope="scope">
								<span>{{scope.row.extendsList | getFieldValues('S_O_000183') | getPrem}} 元</span>
							</template>
					</el-table-column>
					<el-table-column prop="additionalpremium" label="附件" align="center" min-width="180">
							<template slot-scope="scope">
								<el-button type="text" @click="downLoadFile('A104',scope.row.bizResVOList)">购置发票</el-button>
								<el-button type="text" @click="downLoadFile('A103',scope.row.bizResVOList)">车辆合格证</el-button>
							</template>
					</el-table-column>
				</el-table>
				<div class="content-total" v-if="this.$route.query.index != '4'">
					<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
				</div>
			</div>
			<div class="data-form" v-if="buttonFlag=='zz'">
				<el-table :data="data1"  fit style="width:100%;" highlight-current-row show-header v-if="$route.query.index == '1'" :header-cell-style="getRowClass1" border>
					<el-table-column  type="index" label="序号" width="60" align="center"></el-table-column>
					<el-table-column label="电梯信息" width="375">
						<template slot-scope="scope">
							<div class="data-item">
								<p class="color-gray-6 f14 lh30">
									<span style="color:#0F54A9">{{scope.row.useUnit || '无'}}</span>
								</p>
								<p class="color-gray-6 f14 lh30">
									<span class="color-gray-0">坐落地址：</span>
									<span class="color-gray-0">{{scope.row.provinceName}}</span>
									<span class="color-gray-0" v-if="scope.row.cityName">/</span>
									<span class="color-gray-0">{{scope.row.cityName}}</span>
									<span class="color-gray-0" v-if="scope.row.countryName">/</span>
									<span class="color-gray-0">{{scope.row.countryName}}</span>
									<span class="color-gray-0" v-if="scope.row.address">/</span>
									<span class="color-gray-0">{{scope.row.address}}</span>
								</p>
								<p class="color-gray-6 f14 lh30">
									<span class="color-gray-0">使用场所：</span>
									<span class="color-gray-0">{{scope.row.site?scope.row.site:'无'}}</span>
								</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="设备(出厂)编号" align="center" width="300">
						<template slot-scope="scope">
							<span class="color-gray-0">{{scope.row.equipmentsCode || scope.row.factoryNumber}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="年限/载重/高度" align="center" width="300">
						<template slot-scope="scope">
							<p class="color-gray-0 f14 lh30">
								<span style="color:#096DD9" v-if="scope.row.year !== '' || scope.row.year !== null">{{scope.row.year}}  <span style="color:#00">年</span></span>
								<span v-else>无</span>
							</p>
							<p class="color-gray-0 f14 lh30">
								<span v-if="scope.row.eleType"><span v-if="scope.row.eleType">{{scope.row.eleType}}</span><span v-else>无</span></span>
								<span v-if="scope.row.height">{{scope.row.height}}m</span>
								<span v-else-if="scope.row.weight">{{scope.row.weight}}KG</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保险期间" align="center" width="251">
						<template slot-scope="scope">
							<p class="color-gray-0">{{scope.row.startDate | timer}} 至 {{scope.row.endDate | timer}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保费（元）" width="300">
						<template slot-scope="scope">
							<p v-if="scope">--</p>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '2'" :header-cell-style="getRowClass">
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" label="姓名" align="center"></el-table-column>
					<el-table-column prop="policyHolderName" label="证件类型" >
						<template slot-scope="scope">
							<p>
								<span v-if="scope.row.licenceType == 1">中国居民身份证</span>
								<span v-if="scope.row.licenceType == 2">护照</span>
								<span v-if="scope.row.licenceType == 3">澳门身份证</span>
								<span v-if="scope.row.licenceType == 4">军官证</span>
							</p>
							<p>{{scope.row.licenceNo}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="岗位" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.post ">{{scope.row.post}}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="state" label="是否有工伤保险" align="center" v-if="$route.query.productCode == '21PR380984'">
						<template slot-scope="scope">
							<span v-if="scope.row.hasInjuryInsurance ">{{scope.row.hasInjuryInsurance}}</span>
						</template>
					</el-table-column> -->
					<el-table-column  label="保险期间" align="center" width="251">
						<template slot-scope="scope">
							<p>{{scope.row.startDate | timer}} 至 {{scope.row.endDate | timer}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="保费（元）" align="center">
						<template slot-scope="scope">
							<p v-if="scope"> --</p>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="data1" border fit style="width: 100%" highlight-current-row show-header v-if="$route.query.index == '5'" :header-cell-style="getRowClass">
						<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
						<el-table-column prop="name" label="项目名称" min-width="200">
							<template slot-scope="scope">
								<p>
									<span style="color:#0F54A9">{{scope.row.name}}</span>
								</p>
								<p>
									<span>项目地址：</span>
									<span>{{scope.row.provinceName}}</span>
									<span>{{scope.row.cityName}}</span>
									<span>{{scope.row.countryName}}</span>
									<span>{{scope.row.address}}</span>
								</p>
								<p>
									<span>项目类型：</span>
									<span>{{scope.row.style}}</span>
								</p>
							</template>
						</el-table-column>
						<el-table-column prop="areaBuild" label="建筑面积/车位数/游泳池数/电梯数" align="center">
							<template slot-scope="scope">
								<span>{{scope.row.area}}(平米)</span>
								<span>/{{scope.row.carSpace}}个</span>
								<span>/{{scope.row.swimmingPool}}个</span>
								<span>/{{scope.row.elevatorNum}}个</span>
							</template>
						</el-table-column>

						<el-table-column prop="state" label="保险期间" align="center" min-width="160">
							<template slot-scope="scope">
								<span>{{scope.row.startDate | timer}} 至 {{scope.row.endDate | timer}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="riskFree" label="保费" align="center">
							<template>
								<span>-</span>
							</template>
						</el-table-column>
				</el-table>
				<div class="content-total" v-if="this.$route.query.index != '4'">
					<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :total="total"> </el-pagination>
				</div>
			</div>

				
			</div>
		</div>
</template>

<script>
import {elevator} from '../../server/accidenServer.js';
import productService from "@/service/ProductService";
import ResourcesService from "@/service/ResourcesService";
import elevatorType from '../../../static/data/elevatorType.json';
import equipmentsType from '../../../static/data/equipmentsType.json';
import passengerLastyear from '../../../static/data/passengerLastyear.json';
import stringHelper from '@/util/stringHelper'
import moment from 'moment'
export default {
	data() {
		return {
			productService: new productService(),
			ResourcesService: new ResourcesService(),
			Elevator:new elevator(),
			buttonFlag:'ys',
			data:{},
			data1:[],
			data2:[],
			total:0,
			pageNum: 1,
			pagesize: 10,
			currentPage:1,
			riskList:[],
			placeUse:[],
			etype:[],
			datas:[],
			userType:[],
			hasInjuryInsurance:[]
		}
	},
	created(){
		this.getAppDetailPro();
		this.datas = JSON.parse(window.sessionStorage.getItem('list'));
	},
	filters:{
		timer(val){
			return  val.split(' ')[0]
		},
		getFieldValues(val,fieldCode){
			let { fieldValues } = val.find(item=>item.fieldCode === fieldCode) || '无'
			return  fieldValues
		},
		// 获取机械类别
		getMechanicsType(val) {
			let mechanicalCategoryOpting = [
					{
						value: '00',
						label: '轮式'
					},
					{
						value: '01',
						label: '履带式'
					},
					{
						value: '02',
						label: '其他'
					},
				]	// 起重机械类别
				let { label } = mechanicalCategoryOpting.find(item=>item.value == val) || '无'
				return label
		},
		getPrem(val){
				let prem = stringHelper.formatMoney(val)
				return prem || '0.00'
		}
	},

	methods: {
		getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #F8F8F8;color:#666666;font-size:14px;font-weight:600;text-align: center;';
            } else {
                return 'background: #fff';
            }
		},
		getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #F8F8F8;color:#666666;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
		// 查询最终清单合原始清单数据
		setChangeData(val){
			this.buttonFlag = val
			this.pageNum = 1
			this.currentPage = 1
			this.total = 0
			if(val == 'ys'){
				if(this.$route.query.index == '5') {
					this.projectList();
				} else {
					this.EquipmentList();
				}
			} else {
				// 1电梯 2雇主 3索道 4团意 5物业 6家政 7家财
				if(this.$route.query.index == '1') {
					this.policylistDT()
				} else if(this.$route.query.index == '5'){
					this.policylistWY()
				} else if(this.$route.query.index == '2'){
					this.policylistGZ()
				}
			}
		},
		async policylistDT(){ // 获取投保单列表
			let data =  {
				pageNum: this.pageNum,
				pageSize: 10,
				policyNo: this.data.policyNo,
				dataScope: '1',
				userCode:window.sessionStorage.getItem('userCode')
			};
			let res = await this.Elevator.postSequipList(data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
		async policylistGZ(){ // 获取投保单列表
			let data =  {
				pageNum: this.pageNum,
				pageSize: 10,
				policyNo: this.data.policyNo,
				dataScope: '1',
				userCode:window.sessionStorage.getItem('userCode')
			};
			let res  = await this.Elevator.postEmployeeList(data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
		async policylistWY(){
			let data =  {
				pageNum: this.pageNum,
				pageSize: 10,
				policyNo: this.data.policyNo,
				dataScope: '1',
				userCode:window.sessionStorage.getItem('userCode')
			};
			let res  = await this.Elevator.postPropertyList(data);
			if(res.code == '0000' && res.list.length != 0) {
				this.total = res.total;
				res.list.forEach(i => {
					i.styleName = this.placeUse.find(t => t.code == i.style) ? this.placeUse.find(t => t.code == i.style).value : ''
				})
				console.log(res.list,'res.list');
				this.data1 = res.list;
			} else {
				this.total = 0;
				this.data1 = [];
			}
		},
		async getAppDetailPro(){//投保单详情
			let data = {
				'appCode':this.$route.query.appCode
			}
			const parmes = await this.Elevator.getAppDetailPro(data);
			if(parmes.code == '0000'){
				this.data = parmes.data;
				// 处理订单状态
				if(this.data.orderStatus == '01'){
					this.data.orderStatusName = '待支付';
					this.data.orderStatusColor = '#48BDF0';
				}else if(this.data.orderStatus == '02'){
					this.data.orderStatusName = '部分付款';
					this.data.orderStatusColor = '#74b241';
				}else if(this.data.orderStatus == '03' || this.data.orderStatus == '04'){
					this.data.orderStatusName = '已支付';
					this.data.orderStatusColor = '#74b241';
				}else if(this.data.orderStatus == '08'){
					this.data.orderStatusName = '支付失败';
					this.data.orderStatusColor = '#181E2D';
				}else if(this.data.orderStatus == '09'){
					this.data.orderStatusName = '已取消';
					this.data.orderStatusColor = '#181E2D';
				};
				// 1电梯 2雇主 3索道 4团意 5物业 6家政 7家财
				if(this.$route.query.index == '4'){
					this.data2 = [];
					this.data.insuredList.forEach(item =>{
						this.data2.push(item.human)
					});
					this.data2.forEach(ele =>{
						if(ele.licenceType == 'cardType_0'){
							ele.licenceType = '中国居民身份证';
						}else{
							ele.licenceType = '其他';
						};
						if(ele.occupationType == '1'){
							ele.occupationType = '安装工';
						}else if(ele.occupationType == '2'){
							ele.occupationType = '维保工';
						}else if(ele.occupationType == '3'){
							ele.occupationType = '安装工兼维保工';
						}else if(ele.occupationType == '5'){
							ele.occupationType = '电梯安装维修工';
						}else if(ele.occupationType == '6'){
							ele.occupationType = '办公人员';
						}else if(ele.occupationType == '7'){
							ele.occupationType = '拆卸工';
						}else{
							ele.occupationType = '其他';
						};
						ele.birthday = moment(ele.birthday).format('YYYY-MM-DD')
					});
				}else if(this.$route.query.index == '1'){
					this.productDisplay();
				}else if(this.$route.query.index == '5'){
					this.productDisplay1();
				}else if(this.$route.query.index == '2' &&(this.$route.query.productCode == '20PR415913'  || this.$route.query.productCode == '20PR164925' || this.$route.query.productCode == '21PR654284'  || this.$route.query.productCode == '21PR179936' || this.$route.query.productCode == '21PR380984'  || this.$route.query.productCode == '23PR380682')){
					this.productDisplay();
				}else if(this.$route.query.index == '6'){
					this.productDisplay();
				}else{
					this.riskList = parmes.data.riskList;
					this.EquipmentList();
				}
			}
		},
		async productDisplay() {
            const params = await this.productService.productDisplay(this.$route.query.productCode);
            if (params.code == "0000") {
				this.placeUse = [];
				this.elevatorTypes = [];
				this.etype = [];
                let theElevatorSpace=params.data.list[params.data.list.map(item => item.sign).indexOf("theElevatorSpace")]; //获取电梯使用场所因子
				this.placeUse = params.data.list[params.data.list.map(item => item.sign).indexOf("theElevatorSpace")]?params.data.list[params.data.list.map(item => item.sign).indexOf("theElevatorSpace")].list:[]; //获取电梯使用场所因子
				this.etype = params.data.list[params.data.list.map(item => item.sign).indexOf('etype')]?params.data.list[params.data.list.map(item => item.sign).indexOf('etype')]:[];  //雇员类型因子
				this.userType = params.data.list[params.data.list.map(item => item.sign).indexOf('userType')]?params.data.list[params.data.list.map(item => item.sign).indexOf('userType')]:[];  // 家政服务雇员类型因子
				this.hasInjuryInsurance = params.data.list[params.data.list.map(item => item.sign).indexOf('isInsurance')]?params.data.list[params.data.list.map(item => item.sign).indexOf('isInsurance')]:[];  // 是否有工伤保险
				this.EquipmentList();
            }
		},
		async productDisplay1() {
            const params = await this.productService.productDisplay(this.$route.query.productCode);
            if (params.code == "0000") {
				this.placeUse = [];
                let theElevatorSpace=params.data.list[params.data.list.map(item => item.sign).indexOf("ptype")]; //获取项目类型因子
				this.placeUse = params.data.list[params.data.list.map(item => item.sign).indexOf("ptype")]?params.data.list[params.data.list.map(item => item.sign).indexOf("ptype")].list:[]; 
				this.projectList();
            }
		},
		async projectList() {
			let data ={
				applicationFormCode:this.$route.query.appCode,
				pn:this.pageNum,
				ps:this.pagesize
			};
			let res = await this.Elevator.getInsurance(data);
			let {code} = res
			if(code == "0000"){
				this.data1 = res.list;
				this.total = res.total;
				for(var i=0;i<this.data1.length;i++){
					let ele = this.data1[i]
					ele.province = this.getFieldName(ele.extendsList,'S_O_000105','fieldCode','fieldValues','')
					ele.city = this.getFieldName(ele.extendsList,'S_O_000106','fieldCode','fieldValues','')
					ele.county = this.getFieldName(ele.extendsList,'S_O_000107','fieldCode','fieldValues','')
					ele.address = this.getFieldName(ele.extendsList,'S_O_000109','fieldCode','fieldValues','')
					ele.projectName = this.getFieldName(ele.extendsList,'S_O_000108','fieldCode','fieldValues','')
					ele.pools = this.getFieldName(ele.extendsList,'S_O_000099','fieldCode','fieldValues','')
					ele.cars = this.getFieldName(ele.extendsList,'S_O_000098','fieldCode','fieldValues','')
					ele.riskFree = this.getFieldName(ele.extendsList,'S_O_000016','fieldCode','fieldValues','')
					ele.areaBuild = this.getFieldName(ele.extendsList,'S_O_000097','fieldCode','fieldValues','')
					ele.elevatorNum = this.getFieldName(ele.extendsList,'S_O_000189','fieldCode','fieldValues','')
					let S_O_000095 = this.getFieldName(ele.extendsList,'S_O_000095','fieldCode','fieldValues','')
					if(S_O_000095){
						this.placeUse.find(item =>{
							if(S_O_000095 == item.code){
								ele.projectClassName = item.showValue
							}
						})
					}
					ele.startDate = this.data.startDate;
					ele.endDate = this.data.endDate;
				}
			}
		},
		//设备清单
		async EquipmentList(){
			let data ={
				applicationFormCode:this.$route.query.appCode,
				pn:this.pageNum,
				ps:this.pagesize
			};
			let res = await this.Elevator.getInsurance(data);
			if(res.code == '0000'){
				this.data1 = res.list;
				this.total = res.total;
				if(this.$route.query.index == '2'){ 
					this.data1.map((subItem,index) => {
						if(subItem.objectType != '22') {
							this.data1.splice(index,1)
						}
						subItem.startDate = this.data.startDate;
						subItem.endDate = this.data.endDate;
					})
				}
				if(this.$route.query.index == '1'){
					for(var j=0;j<this.data1.length;j++){
						let ele = this.data1[j]
						ele.startDate = this.data.startDate;
						ele.endDate = this.data.endDate;
						if(ele.extendsList.find(item => item.fieldCode == 'S_O_000000').fieldValues){
							elevatorType.data.find(item =>{
								if(ele.extendsList.find(item => item.fieldCode == 'S_O_000000').fieldValues == item.code){
									ele.name = item.name
								}
							})
						}
						if(ele.extendsList.find(item => item.fieldCode == 'S_O_000001').fieldValues){
							this.placeUse.find(item =>{
								if(ele.extendsList.find(item => item.fieldCode == 'S_O_000001').fieldValues == item.code){
									ele.names = item.showValue
								}
							})
						}
					}
				}else if(this.$route.query.index == '3'){
					this.data1[0].name = this.data1[0].extendsList.find(item => item.fieldCode == 'S_O_000050').fieldValues;
					for(var l=0;l<equipmentsType.data.length;l++){
						if(this.data1[0].extendsList.find(item => item.fieldCode == 'S_O_000051').fieldValues == equipmentsType.data[l].value){
							this.data1[0].type = equipmentsType.data[l].label;
						}
					}
					for(var q=0;q<passengerLastyear.data.length;q++){
						if(this.data1[0].extendsList.find(item => item.fieldCode == 'S_O_000052').fieldValues == passengerLastyear.data[q].value){
							this.data1[0].passengerLastyear = passengerLastyear.data[q].label;
						}
					}
					this.data1[0].basicpremium = 0;
					this.data1[0].additionalpremium = 0;
					this.data1[0].totalpremium = 0;
					for(var t=0;t<this.riskLis.length;t++){
						if(this.riskLis[t].riskFlag2 == 'M'){
							this.data1[0].basicpremium += this.riskLis[t].actualPrem;
						}else{
							this.data1[0].additionalpremium += this.riskLis[t].actualPrem;
						}
					}
					this.data1[0].totalpremium = this.data1[0].basicpremium + this.data1[0].additionalpremium
				}else if(this.$route.query.index == '2' && (this.$route.query.productCode == '20PR415913'  || this.$route.query.productCode == '20PR164925' || this.$route.query.productCode == '21PR654284'  || this.$route.query.productCode == '21PR179936' || this.$route.query.productCode == '21PR380984')){
					this.data1.forEach(item=>{
						let S_O_000100 = item.extendsList.find(item => item.fieldCode == 'S_O_000100')
						let S_O_000167 = item.extendsList.find(item => item.fieldCode == 'S_O_000167')
						if(S_O_000100){
							item.etypeName = this.etype.list.find(item=>item.code==S_O_000100.fieldValues)?this.etype.list.find(item=>item.code==S_O_000100.fieldValues).showValue:'';
						}
						if(S_O_000167){
							item.hasInjuryInsurance = this.hasInjuryInsurance.list.find(item=>item.code==S_O_000167.fieldValues)?this.hasInjuryInsurance.list.find(item=>item.code==S_O_000167.fieldValues).showValue:'';
						}
					})
				}else if(this.$route.query.index == '2' && ( this.$route.query.productCode == '23PR380682')){
					this.data1.forEach(item=>{
						let S_O_000100 = item.extendsList.find(item => item.fieldCode == 'S_O_000100')
						if(S_O_000100){
							item.etypeName = this.etype.list.find(item=>item.code==S_O_000100.fieldValues)?this.etype.list.find(item=>item.code==S_O_000100.fieldValues).showValue:'';
						}
					})
				} else if(this.$route.query.index == '6'){
					this.data1.forEach(item=>{
						let S_O_000132 = item.extendsList.find(item => item.fieldCode == 'S_O_000132')
						if(S_O_000132){
							item.etypeName = this.userType.list.find(item=>item.code==S_O_000132.fieldValues)?this.userType.list.find(item=>item.code==S_O_000132.fieldValues).showValue:'';
						}
					})
				}
			}
		},
		handleCurrentChange: function(pageNum){
			this.pageNum = pageNum;
			if(this.buttonFlag == 'ys'){
				if(this.$route.query.index == '5') {
					this.projectList();
				} else {
					this.EquipmentList();
				}
			} else {
				// 1电梯 2雇主 3索道 4团意 5物业 6家政 7家财
				if(this.$route.query.index == '1') {
					this.policylistDT()
				} else if(this.$route.query.index == '5'){
					this.policylistWY()
				} else if(this.$route.query.index == '2'){
					this.policylistGZ()
				}
			}
		},
		async exports(){
			if(this.buttonFlag == 'ys'){
				if(this.$route.query.index == '1') {
					this.ResourcesService.exportsViewFile(this.$apiUrl.EXPORTEQUIPMENT,{'applicationFormCode':this.$route.query.appCode})
				}
			} else {
				let data =  {
					policyNo: this.data.policyNo,
					dataScope: '1',
					userCode:window.sessionStorage.getItem('userCode')
				};
				// 1电梯 2雇主 3索道 4团意 5物业 6家政 7家财
				if(this.$route.query.index == '1') {
					this.ResourcesService.exportsViewFile(this.$apiUrl.ELEVATOREXPORT,data)
				} else if(this.$route.query.index == '5'){
					this.ResourcesService.exportsViewFile(this.$apiUrl.PROPERTYEXPORT,data)
				} else if(this.$route.query.index == '2'){
					this.ResourcesService.exportsViewFile(this.$apiUrl.EMPLOYEEEXPORT,data)
				}
			}
			
			this.$logger.info('M1-005','',{'applicationFormCode':this.$route.query.appCode});
		},
		async downLoadFile(key,bizResVOList){
			let { fileUrl } = bizResVOList.find(item=>item.resCode == key) || ''
			if(fileUrl) {
				this.ResourcesService.downloadOrViewFile(fileUrl,true);
			}
		},
		async modify(row){//电子凭证
			let res = await this.Elevator.resourceid(row.id);
			if(res.code == '0000'){
				window.location.href = this.$apiUrl.COM_INDENT + res.data.resId;
			}
		},
		relation(row){
			this.$message.error('发送失败！');
			return
		},
		bonback(){
			window.location.href="about:blank";
			window.close();
		},
		bonbackDetails(){
			let routeData = this.$router.resolve({
				path:'/order/detail',
				query:{
					orderCode:this.data.orderCode,
					appCode:this.$route.query.appCode,
				}
			});
			window.open(routeData.href, '_blank');
			window.location.href="about:blank";
			window.close();
		},
		// 跳转追加标的url
		redirectURL(url="",appCode="",productCode=""){
			this.$router.push({
				path:url,
				query:{
					appCode:appCode,
					productCode:productCode,
				},
			})
		},
		// 获取标的里面拓展字段信息
		getFieldName(val,fieldCode,fieldKey='fieldCode',returnKey='fieldValues',returnValue='无'){
			let obj = val.find(item=>item[fieldKey] === fieldCode) 
			return obj && obj[returnKey]? obj[returnKey] : returnValue
		},
	},
}

</script>

<style lang="less">
#electroniCvouchers{
	padding-bottom: 80px;
	box-sizing: border-box;
	.content1{
		position: relative;
		width: calc(100% - 50px);
		height: 82px;
		padding: 30px 0 20px 30px;
		box-sizing: border-box;
		background-color: #fff;
		margin-left: 20px;
		.content1-box-title {
			position: absolute;
			left: 30px;
			font-size: 20px;
			color: #101010;
		}
		.content1-box-order {
			position: absolute;
			left: 300px;
			color: rgba(250, 140, 22, 100);
			font-size: 14px;
			height: 30px;
			line-height: 30px;
			cursor: pointer;
		}
		.content1-box-return {
			position: absolute;
			right: 30px;
			width: 84px;
			height: 30px;
			line-height: 30px;
			border-radius: 19px;
			background-color: #F5F5F5;
			color: rgba(64, 64, 64, 100);
			font-size: 14px;
			text-align: center;
			font-family: Microsoft Yahei;
			border: 1px solid #BFBFBF;
			cursor: pointer;
		}
	}
	.policy-details {
		width: calc(100% - 50px);
		height: 82px;
		padding: 30px 0 20px 30px;
		box-sizing: border-box;
		background-color: #fff;
		margin: 10px 0;
		margin-left: 20px;
	}
	
	.content-table{
		width: calc(100%-50px);
		margin: 0 30px 0 20px;
		background-color: #ffffff;
		.content-table-title {
			position: relative;
			padding: 20px;
			height: 40px;
			.w80 {
				min-width: 80px;
				border: 1px solid #E6A23C;
				color:#E6A23C;
			}
			.el-button--warning {
				background-color: #ffe7ba;
			}
			.content-table-title-l {
				position: absolute;
				left: 40px;
			}
			.content-table-title-r {
				position: absolute;
				right: 40px;
			}
		}
		.content3{
			width: 100%;
			height: 59px;
			line-height: 59px;
			text-align: right;
			padding-right: 20px;
			box-sizing: border-box;
			font-size: 16px;
			.content1-exports{
				float: right;
				margin-right: 20px;
				color: #DB9728;
				cursor: pointer;
				img{
					width: 28px;
					height: 28px;
					vertical-align: middle;
				}
			}
			.item7{
				display: inline-block;
				width:76px;
				height:34px;
				background:rgba(248,248,248,1);
				border:1px solid rgba(241, 238, 233, 1);
				border-radius:4px;
				text-align: center;
				line-height: 34px;
				margin-right: 40px;
				color: #666666;
				cursor: pointer;
			}
		}
		.data-form{
			width: 100%;
			padding: 0 30px;
			box-sizing: border-box;
		}
		.content-total{
			width: calc(100% - 50px);
			margin: 30px 30px 0 20px;
			height: 60px;
			line-height: 60px;
			text-align: right;
		}
	}
}
</style>
