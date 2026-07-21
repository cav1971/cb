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
следующа поблема которая нас поджидала была следующей
```
Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
Run actions/setup-node@v4
  with:
    node-version: 24
    cache: npm
    cache-dependency-path: package-locks.json
    always-auth: false
    check-latest: false
    token: ***
Found in cache @ /opt/hostedtoolcache/node/24.18.0/x64
(node:2277) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead.
(Use node --trace-deprecation ... to show where the warning was created)
Environment details
  node: v24.18.0
  npm: 11.16.0
  yarn: 1.22.22
/opt/hostedtoolcache/node/24.18.0/x64/bin/npm config get cache
/home/runner/.npm
Error: Some specified paths were not resolved, unable to cache dependencies. 
в чем здесь первая проблема?
```
на что ИИ ответила так
```
Первая проблема — это невозможность кэширования зависимостей (ошибка Error: Some specified paths were not resolved, unable to cache dependencies). 

Она возникает на этапе выполнения шага actions/setup-node@v4. Инструкция пытается сохранить директорию с пакетами по пути /home/runner/.npm, но не может этого сделать. Предупреждение о депрекации Node 20 и сам факт запуска на Node 24 в данном случае являются лишь информационным контекстом.

Основные причины этой ошибки:

Отсутствие файла блокировки. Вы указали параметр cache-dependency-path: package-locks.json. Если файл package-locks.json отсутствует в корне репозитория или находится в другой директории, действие не находит указанный путь и прерывает кэширование. Также ошибка возникнет, если используется менеджер пакетов Yarn (yarn.lock) или PNPM (pnpm-lock.yaml), а указан путь для NPM.
``` 
исправляем имя файла пакетов и повторяем коммит.
следующую проблему словили на lint
```
Run npm run lint:ci
npm error Missing script: "lint:ci"
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-07-21T17_54_42_491Z-debug-0.log
Error: Process completed with exit code 1.
```
что ответил ИИ
```
Почему это произошло (первая проблема):
Пайплайн ожидает найти скрипт для линтинга именно под ключом "lint:ci", но его там нет. Это частое расхождение между конфигурацией CI/CD и локальным проектом. Название могло измениться при рефакторинге, или вы скопировали чужой шаблон workflow без адаптации под свой проект.
```
да действительно в файле пакетов этой строки небыло, было просто lint
исправляем и проверяем снова

опять словили ошибку.
```
Run node dist/main.js
node:internal/modules/cjs/loader:1520
  throw err;
  ^

Error: Cannot find module '/home/runner/work/cb/cb/dist/main.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1517:15)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1122:12)
    at Module._load (node:internal/modules/cjs/loader:1294:5)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.18.0
Error: Process completed with exit code 1.
```
сразу скажу, что с помощю ИИ прямого ответа я не получил, только намеки на то что файла dist/main.js  нет, для решения данной проблемы я в терминале выполнил команду
```
npm run build
```
которая успешно выполнилась, и создала каталог dist в котором я посмотрел получившиеся файлы, в нашем случае это:
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          21.07.2026    23:04             38 build-info.txt
-a---          21.07.2026    23:04            144 index.js
-a---          21.07.2026    23:04            131 orderedPair.js
-a---          21.07.2026    23:04             82 sum.js
```
исправляем актион и продолжает проверку
```      
      - name: Smoke check build output
        run: node dist/index.js
```
