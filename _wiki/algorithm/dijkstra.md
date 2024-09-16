---
layout  : wiki
title   : 데이크스트라 알고리즘
summary : 최단경로 알고리즘
date    : 2024-09-13 15:05:49 +0900
updated : 2024-09-16 13:07:42 +0900
tag     : dijkstra
toc     : true
public  : true
parent  : [[/algorithm/graph]]
latex   : false
resource: 28BF8765-DD61-43FE-8D87-4527461765BA
---
* TOC
{:toc}

## 우선 순위 큐(min-heap)를 활용한 데이크스트라 알고리즘

```cpp
#include <iostream>
#include <limits.h>
#include <queue>
#include <vector>

using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  int v, e, s;
  cin >> v >> e >> s;
  vector<pair<int, int>> adj[v + 1];

  for (int i = 0; i < e; ++i) {
    int a, b, c;
    cin >> a >> b >> c;
    adj[a].push_back({c, b});
  }

  priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
  vector<int> dist(v + 1, INT_MAX);

  pq.push({0, s});
  dist[s] = 0;
  while (!pq.empty()) {
    pair<int, int> cur = pq.top(); pq.pop();

    // dist에 저장된 비용이 현재 노드의 비용과 다르다면 패스한다.
    // dist에 저장된 비용은 항상 가장 적다.
    if (dist[cur.second] != cur.first) continue;

    for (const auto &nxt : adj[cur.second]) {
      int cost = dist[cur.second] + nxt.first;
      if (dist[nxt.second] <= cost) continue;
      dist[nxt.second] = cost;
      pq.push({dist[nxt.second], nxt.second});
    }

  }

  for (int i = 1; i < dist.size(); ++i) {
    if (dist[i] == INT_MAX) cout << "INF\n";
    else cout << dist[i] << "\n";
  }

  return 0;
}
```

## 경로 복원

경로 테이블을 추가해 갱신이 일어날 때,
갱신된 노드의 경로 테이블에 현재 노드를 기록해준다.

경로를 구할 때는 원하는 노드에서 시작해 역순으로 따라간다.

```cpp
  ...
  vector<int> dist(v + 1, INT_MAX);
  vector<int> pre(v + 1, 0); // 경로 테이블, 존재하지 않는 0번 노드를 가르킨다.

  pq.push({0, s});
  dist[s] = 0;
  while (!pq.empty()) {
    pair<int, int> cur = pq.top();
    pq.pop();
    if (dist[cur.second] != cur.first)
      continue;
    for (const auto &nxt : adj[cur.second]) {
      int cost = dist[cur.second] + nxt.first;
      if (dist[nxt.second] <= cost)
        continue;
      pre[nxt.second] = cur.second; // 경로 테이블을 갱신한다.
      dist[nxt.second] = cost;
      pq.push({dist[nxt.second], nxt.second});
    }
  }
  ...
```

## Links
- [[바킹독의 실전 알고리즘] 0x1D강 - 다익스트라 알고리즘](https://youtu.be/o9BnvwgPT-o?si=E-5JK7EUX4pYNM1o)

