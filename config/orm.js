module.exports = {
  equipment: {
    url: 'http://directory.17kong.com/api',
    search: 'YiQiKong/Directory/searchEquipments',
    getlist: 'YiQiKong/Directory/getEquipments'
  },
  reserve: {
    url: 'http://reserve.17kong.com/api',
    search: 'YiQiKong/Reserve/searchReservations',
    getlist: 'YiQiKong/Reserve/getReservations',
  },
  sample: {
    url: 'http://sample.17kong.com/api'
  },
  billing: {
    url: 'http://billing.17kong.com/api'
  },
  user: {
    url: 'http://user.17kong.com/api'
  },
  follow: {
    url: 'http://user.17kong.com/api',
    search: 'YiQiKong/Follow/searchFollows',
    getlist: 'YiQiKong/Follow/getFollows'
  }
}
