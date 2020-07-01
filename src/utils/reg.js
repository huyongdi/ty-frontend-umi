let test = function(idcard) {
  let area = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: 'xinjiang',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  let Y, JYM, ereg;
  let S, M;
  let idcardArray = [];
  idcardArray = idcard.split('');
  if (area[parseInt(idcard.substr(0, 2))] === null) return false;
  switch (idcard.length) {
    case 15:
      if (
        (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 ||
        ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 &&
          (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)
      ) {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; // 测试出生日期的合法性
      } else {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; // 测试出生日期的合法性
      }
      return ereg.test(idcard);
    // break
    case 18:
      if (
        parseInt(idcard.substr(6, 4)) % 4 === 0 ||
        (parseInt(idcard.substr(6, 4)) % 100 === 0 &&
          parseInt(idcard.substr(6, 4)) % 4 === 0)
      ) {
        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
      } else {
        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
      }
      if (ereg.test(idcard)) {
        S =
          (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 +
          (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 +
          (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 +
          (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 +
          (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 +
          (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 +
          (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 +
          parseInt(idcardArray[7]) * 1 +
          parseInt(idcardArray[8]) * 6 +
          parseInt(idcardArray[9]) * 3;
        Y = S % 11;
        M = 'F';
        JYM = '10X98765432';
        M = JYM.substr(Y, 1);
        return M === idcardArray[17];
      }
      return false;
    // break
    default:
      return false;
    // break
  }
};

export default {
  date: /(19|20)[0-9]{2}-(0([1-9])|(10|11|12))-(([0-2][1-9])|10|20|30|31)/,
  age: /^[1-9][0-9]{0,2}$/,
  chinaName: /^[\u4E00-\u9FA5]{1,6}$/,
  idcard: /(^[1-9]\d{5}((18|19|20|)([0-9]{2}))((0([1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31))\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  realIdcard: test,
  imsiImei: /^\d{15}$/,
  mac: /^([A-Fa-f0-9]{2}){6}$/,
  // plate: /^[\S]+$/,
  plate: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{0,1}|民航)[A-Za-z0-9]{4,6}[A-Za-z0-9挂学警港澳使]{1}$/,
  plateColor: /^[蓝黄红白黑绿]{1}([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{0,1}|民航)[A-Za-z0-9]{4,6}[A-Za-z0-9挂学警港澳使]{1}$/,
  wechat: /^[0-9A-Za-z]+$/,
  phone: /^1\d{10}$/,
  qq: /^\d+$/,
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  isInt: /(^[1-9]\d*$)/, // 正整数
  // officerCard: /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/, // 军官证
  officerCard: /^[\u4E00-\u9FA5]([0-9a-zA-z]){1,7}$/, // 军官证
  // ipassPortCard: /^([a-zA-z]|[0-9]){5,17}$/, // 护照
  ipassPortCard: /^([a-zA-z]|[0-9]){1,9}$/, // 护照
  // hkCard: /^[a-zA-Z0-9]{6,10}$/ // 港澳通行证
  hkCard: /^([a-zA-z]|[0-9]){1,9}$/, // 港澳通行证
};
