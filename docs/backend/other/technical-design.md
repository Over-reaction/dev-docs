# 后端技术方案标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.1 | 2026/11/09 | 宁海   | 初稿 |

## 功能：合同管理-合同列表-新增/编辑合同-合同方更新方案

（${一级菜单}-${二级菜单}...${功能名称}）

### 功能说明

合同编辑时，合同方内容更新的功能设计方案。

### 输入条件

- partyType：区分甲、乙、丙、丁、其他方
- groupId：区分是否同一方。如 其他11和 其他12 是同一方的不同主体
- partySort：区分不同方的排序顺序
- entitySort：区分同一方的排序顺序
- partyName：合同方标题名
- partyEntityName：合同方名称
- contactList：对应合同方的联系人数组

#### JSON例子

```json
[
  {
    "partyType": "甲",
    "groupId": "1",
    "partySort": "1",
    "partyName": "甲方",
    "partyEntityName": "广州市白云城市开发投资集团有限公司",
    "entitySort": "1",
    "contactList": [],
    "rowId": "269126747083402"
  },
  {
    "partyType": "乙",
    "groupId": "2",
    "partySort": "2",
    "partyName": "乙方",
    "partyEntityName": "测试乙方1合同方",
    "entitySort": "1",
    "contactList": [
      {
        "contactName": "测试乙方1联系人",
        "contactPhone": "13888888888"
      }
    ],
    "rowId": "269190190144204"
  },
  {
    "partyType": "丙",
    "groupId": "3",
    "partySort": "3",
    "partyName": "丙方",
    "partyEntityName": "测试丙方1合同方",
    "entitySort": "1",
    "contactList": [
      {
        "contactName": "测试丙方1联系人",
        "contactPhone": "13999999999"
      }
    ],
    "rowId": "1009712872761257"
  },
  {
    "partyType": "丁",
    "groupId": "4",
    "partySort": "4",
    "partyName": "丁方",
    "partyEntityName": "测试丁方1合同方",
    "entitySort": "1",
    "contactList": [
      {
        "contactName": "测试丁方1联系人",
        "contactPhone": "13777777777"
      }
    ],
    "rowId": "1009712872792860"
  },
  {
    "partyType": "其他方",
    "groupId": "5",
    "partySort": "5",
    "partyName": "其他1",
    "partyEntityName": "测试其他1合同方",
    "entitySort": "1",
    "contactList": [
      {
        "contactName": "测试其他1联系人",
        "contactPhone": "13666666666"
      }
    ],
    "rowId": "1009712872795552"
  },
  {
    "partyType": "其他方",
    "groupId": "5",
    "partySort": "5",
    "partyName": "其他1",
    "partyEntityName": "测试其他11合同方",
    "entitySort": "2",
    "contactList": [
      {
        "contactName": "测试其他11联系人",
        "contactPhone": "13666666665"
      }
    ]
  },
  {
    "partyType": "其他方",
    "groupId": "6",
    "partySort": "6",
    "partyName": "其他2",
    "partyEntityName": "测试其他2合同方",
    "entitySort": "1",
    "contactList": [
      {
        "contactName": "测试其他2联系人",
        "contactPhone": "13666666644"
      }
    ]
  }
]
```

### 处理规则

需要说明该功能的实现逻辑和关键技术点

1. 识别主体属于我方还是对方

2. 按暂存/提交规则校验

3. 逻辑删当前合同旧数据

4. 将本次主体和联系人分别保存到合同主体表和合同主体联系人表

5. | 数据       | 保存位置                 | 关联字段                                   |
   | ---------- | ------------------------ | ------------------------------------------ |
   | 合同主体   | `contract_party`         | `contract_row_id`                          |
   | 主体联系人 | `contract_party_contact` | `contract_party_row_id`、`contract_row_id` |

### 输出结果

- msg：操作提示
- code：操作响应码，200为成功，其他为失败

#### JSON例子

```json
{
  "msg": "操作成功",
  "code": 200,
  "data": { "valid": true, "missingPartyList": [] }
}
```

### 异常处理

- 异常事务回滚，不修改数据

### 数据库设计

- 合同表

- 合同主体表

- 合同主体联系人表

  <img src="https://test.byljfl.com/byjkFile/byjk/finance/2026/10/28/Snipaste_2026-10-28_18-03-46_20261028180403A133.jpg"/>
