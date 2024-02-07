#!/bin/bash

# 执行 npm run build
npm run build

# 检查 nom run build 是否成功
if [ $? -eq 0 ]; then
    echo "Build 成功，开始执行 scp 操作"
    
    # 使用 scp 命令将 .build/* 目录下的内容拷贝到远程服务器
    scp -r ./build/* root@jparm.hubber.top:/var/www/client
    
    # 检查 scp 命令是否成功
    if [ $? -eq 0 ]; then
        echo "scp 操作成功"
    else
        echo "scp 操作失败"
    fi
else
    echo "Build 失败，无法执行 scp 操作"
fi
