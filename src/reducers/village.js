import assign from 'lodash.assign'

let _state = {
  villageSelected: {
    // 'resortId': 1,
    // 'resortName': '卡帕莱',
    // 'resortCode': 'KPL',
    // 'brandId': 25,
    // 'brandName': '潜游沙巴·仙本那',
    // 'initiatePrice': 1000,
    // 'resortImg': '/source/image/product/thum/thum_8f217c44-f783-408a-9cc1-9c230c680769.JPG',
    // 'resortThumb': '/source/image/product/thum/thum_8f217c44-f783-408a-9cc1-9c230c680769.JPG',
    // 'recommendation': '<p>2222222222222</p>',
    // 'resortDesc': '<p>111111111111111111</p>',
    // 'refundRuleId': 29,
    // 'earnest': 500,
    // 'label': '热卖',
    // 'createBy': 33,
    // 'createTime': 1503252103000,
    // 'updateBy': null,
    // 'updateTime': null,
    // 'isDelete': 'N',
    // 'villageTime': '2017-09-26T01:53:22.693Z',
    // 'villageLeave': 86400000
  },
  summary: false,
  roomType: [
    // {
    //   'apartmentId': 1,
    //   'apartmentName': '园景房',
    //   'apartmentCode': 'KPLyjf',
    //   'apartmentImg': '/source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg',
    //   'apartmentThumb': '/source/image/product/thum/thum_17f9b08b-b21e-4638-aaec-67bd2ce913f7.jpg',
    //   'apartmentDesc': '房间描述信息 房间描述信息 房间描述信息 房间描述信息 房间描述信息 房间描述信息',
    //   'bedType': '大床,双人床,单床,蜜月大床',
    //   'notice': '入住须知 入住须知 入住须知 入住须知 入住须知',
    //   'facilities': '',
    //   'adultMax': 2,
    //   'adultMin': 1,
    //   'childrenMax': 2,
    //   'childrenMin': 0,
    //   'suggestedNum': 2,
    //   'peopleMax': 4,
    //   'peopleMin': 0,
    //   'createBy': 1,
    //   'createTime': 1505328965000,
    //   'updateBy': null,
    //   'updateTime': null,
    //   'isDelete': 'N',
    //   'resortId': 1,
    //   'policy': '',
    //   'resortCode': 'KPL',
    //   'resortName': '卡帕莱',
    //   'calMethod': null,
    //   'isSaleOut': 'N',
    //   'haveDays': 1,
    //   'ids': '8',
    //   'codes': 'KPLyjf20171001',
    //   'adultPrices': '4000.00',
    //   'childPrices': '2000.00',
    //   'isAvePrice': 'N',
    //   'skuNum': 4,
    //   'initiatePrice': 8000,
    //   'adultUnitPrice': 4000,
    //   'childUnitPrice': 2000,
    //   'selected': 1,
    //   'selectedDate': [
    //     {
    //       'children': 0,
    //       'adult': 1
    //     }
    //   ],
    //   'bedTypeDate': [
    //     {
    //       'List': [
    //         {
    //           'label': '大床',
    //           'value': '大床'
    //         }
    //       ],
    //       'value': ['大床']
    //     }
    //   ]
    // }
  ],
  selected: false
}






const village = (state = _state, action) => {
  switch (action.type) {

    case 'Selected_village':
      let newstate = assign({},state)
      newstate.villageSelected = action.data;
      newstate.selected = true;
      return newstate

    case 'ADD_roomType':
      let roomState = assign({},state)
      roomState.roomType = action.data;
      return roomState

    case 'ADD_summary':
      let summaryState = assign({},state)
      summaryState.summary = action.data;
      return summaryState

    default:
      return state
  }
}

export default village