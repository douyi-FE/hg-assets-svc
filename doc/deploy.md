## 部署流程
### 前端
1. 在前端项目中执行pnpm build
2. 复制其dist目录下的所有文件与文件夹到后端中的html目录下
### 后端
1. 有修改代码或者前端资源有新拷贝的build资源则使用git命令推送到dev分支
2. 登录113.44.53.177服务器
3. cd /home/hg_manage_v2
4. git pull origin dev
5. pnpm build
6. pnpm prod
7. 完成以上步骤即可打开http://113.44.53.177:7001/查看系统
