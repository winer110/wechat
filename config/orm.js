module.exports = {
  equipment: {
    url: 'http://directory.17kong.com/api',
    search: 'YiQiKong/Directory/searchEquipments',
    getlist: 'YiQiKong/Directory/getEquipments',
    getEquipment: 'YiQiKong/Directory/getEquipment',
    status: 'YiQiKong/Follow/getFollow'
  },
  reserve: {
    url: 'http://reserve.17kong.com/api',
    search: 'YiQiKong/Reserve/searchReservations',
    getlist: 'YiQiKong/Reserve/getReservations',
    add: 'YiQiKong/ReserveAction/Add'
    
  },
  sample: {
    url: 'http://sample.17kong.com/api',
    get: 'YiQiKong/Billing/getAccountInfo',
    search: 'YiQiKong/Sample/searchSamples',
    getlist: 'YiQiKong/Sample/getSamples',
    add: 'YiQiKong/SampleAction/Add'
  },
  billing: {
    url: 'http://billing.17kong.com/api',
    get: 'YiQiKong/Billing/getAccountInfo',
    add: 'YiQiKong/Billing/Add'
  },
  user: {
    url: 'http://user.17kong.com/api',
    get: 'YiQiKong/User/getInfo',
    create: 'YiQiKong/User/create',
    link: 'YiQiKong/User/LinkWechat',
    identity: 'YiQiKong/User/linkIdentity',
    auth: 'YiQiKong/User/GetGapperInfo',
    add: 'YiQiKong/User/Add'
  },
  follow: {
    url: 'http://user.17kong.com/api',
    search: 'YiQiKong/Follow/searchFollows',
    getlist: 'YiQiKong/Follow/getFollows',
    bind: 'YiQiKong/Follow/Bind',
    unbind: 'YiQiKong/Follow/Unbind',
    judge: 'YiQiKong/Follow/GetFollow'
  },
  gateway: {
    url: 'http://weixin.17kong.com/api',
    get: 'Wechat/getUnionId',
    info: 'Wechat/getUserInfo'
  },
  gapper: {
    url: 'http://gapper.in/api',
    get: 'Gapper/User/GetGapperInfo',
    auth: 'Gapper/User/getUserByIdentity'
  },
  record: {
    url: 'http://record.17kong.com/api',
    search: 'YiQiKong/Record/searchRecords',
    list: 'YiQiKong/Record/getRecords'
  }
}
