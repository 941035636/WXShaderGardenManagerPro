export function insuredMessage(data) {
  return {
    agentCode: '', //经办人编码 ,
    agentName: '', //经办人名称 ,
    code: '', //自定义编码 ,
    eAppId: '', //电子投保单文件id ,
    ePolicyId: '', //电子保单文件id ,
    emCode: '', //应急局编码
    startDate: '', //保单起期
    endDate: '', //保单止期 ,
    issueDate: '', // 出单日期
    issuingCompanyCode: '', // 保险公司编码
    issuingCompanyName: '', // 保险公司名称
    linkNumber: '', // 联系人手机号 ,
    policyNo: '', //保单号 ,
    policyStatus: '', //保单状态 ,
    prem: 0, //保单保费 ,
    renewal: '', //是否续保 Y是/N否 ,
    renewalPolicyNo: '', //续保单号 ,
    insuredResps: [
      {
        cityCode: '', //市编码 ,
        cityName: '', // 市 ,
        countyCode: '', //区编码 ,
        countyName: '', // 区名称
        employes: '', // 从业人员数 ,
        industryKind1: '', //企业行业类型 一级 ,
        industryKind2: '', //行业二级分类 ,
        industryKind3: '', //行业3级分类 ,
        industryKind4: '', //行业四级分类 ,
        legalPerson: '', // 法人代表 ,
        linkPerson: '', //企业联系人 ,
        linkPhone: '', //联系人手机号 ,
        location: '', // 详细地址 ,
        name: '', //被保人企业名称 ,
        orgCode: '', //三证合一代码 ,
        phoneNumber: '', //法定代表人电话 ,
        provinceCode: '', //省编码 ,
        provinceName: '', //省
        insuredExtendResps: [
          {
            fieldCode: '', //
            fieldValue: '',
          },
        ],
      },
    ],
    policyHolderResp: {
      cityCode: '', //市编码 ,
      cityName: '', //市名称 ,
      countyCode: '', //区编码 ,
      countyName: '', // 区名称
      holderName: '', //投保人名称 ,
      location: '', //详细地址 ,
      orgCode: '', //投保人三证合一代码 ,
      provinceCode: '', //省编码 ,
      provinceName: '', //省名称
    },

    riskResps: [
      // 险种信息 ,
      {
        amount: 0,
        dutyResps: [
          {
            dutyCode: '20ZR105888',
            dutyDesc: '',
            dutyName: '每次事故及累计调查勘验费用责任限额',
            limitResps: [
              {
                limitCode: '20XE459426',
                limitName: '每次事故及累计责任限额',
                limitValue: '4000000',
              },
            ],
          },
        ],
        riskCode: '20XZ553596',
        riskName: '石嘴山市安全生产责任保险（经营企业）',
        riskPrem: 0,
        riskType: '',
      },
    ],
  }
}
