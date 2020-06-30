import mockjs from 'mockjs';

// mockjs.setup({
//   timeout: 400
// })

export default {
  // 使用 mockjs 等三方库
  '/mock/tags': (req, res) => {
    setTimeout(() => {
      res.status(401).send({ message: '无删除权限' });
    }, 5000);
  },
};
