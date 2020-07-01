# ty-frontend-umi
在umi3.X基础上实现业务需要的框架

1. 测试route 以及rematch/redux
2. 实现了主题切换功能
   思路：①.src下新建theme文件夹 新建theme1/theme2.less
        ②.config/config.js 利用webpack.entry().add().end()的功能将less转化为css并输出到dist
        ③.pages/document.ejs下新加一个link用来引入:<link rel="stylesheet" href="/theme1.css" id='theme'>
        ④.此时已经可以通过改变link的href路径还实现切换主题，比如：document.head.querySelector('#theme').setAttribute('href', path)
        ⑤.1-4步完成后，切换了主题，刷新又会掉第一个默认的，这里通过存localStorage,在ejs里面取值来实现持久化
        
        

规范：
弹窗里面的用状态库去取，主页面需要的我会从props传
