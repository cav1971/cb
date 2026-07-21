Создаем репозиторий на github.com(https://github.com/cav1971/cb.git) в него помещаем исходники задания и создаем файл work.md в котором будем протоколировать производимые действия. 
пушим и проверяем первые итоги.
```
Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
```
здесь без ИИ видно проблему, node 20 вышла из обращения и сейчас требуется node 24
```
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: package-locks.json
```
исправляем значение 20 на 24, комитимся.  