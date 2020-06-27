export default function(name) {
  let leftParentNav = [
    {
      name: '首页',
      icon: 'iconshouye',
    },
    {
      name: '预警',
      icon: 'iconyujing',
    },
    {
      name: '统计',
      icon: 'iconxiangmutongji',
    },
    {
      name: '设置',
      icon: 'iconshezhi',
    },
    {
      name: '电话预警',
      icon: 'icondianhuayujing',
    },
    {
      name: '网络预警',
      icon: 'iconwangluoyujing',
    },
    {
      name: '预警处置',
      icon: 'iconyujingchuzhi',
    },
    {
      name: '业务设置',
      icon: 'iconyewushezhi',
    },
    {
      name: '黑名单',
      icon: 'iconheimingdan',
    },
    {
      name: '预警统计',
      icon: 'iconyujingtongji',
    },
  ];
  let nav = leftParentNav.find(item => item.name === name);
  return nav && nav.icon;
}
