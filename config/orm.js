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
  },
  sample: {
    url: 'http://sample.17kong.com/api',
    get: 'YiQiKong/Billing/getAccountInfo'
  },
  billing: {
    url: 'http://billing.17kong.com/api',
    get: 'YiQiKong/Billing/getAccountInfo'
  },
  user: {
    url: 'http://user.17kong.com/api',
    get: 'YiQiKong/User/getInfo'
  },
  follow: {
    url: 'http://user.17kong.com/api',
    search: 'YiQiKong/Follow/searchFollows',
    getlist: 'YiQiKong/Follow/getFollows'
  }
}
