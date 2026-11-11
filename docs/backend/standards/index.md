---
outline: [2, 4]
---

# 后端Java开发标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/08 | 宁海   | 初稿 |

## 目录

1. [编码规约](./coding-guidelines.md)
2. [异常日志](./exception-logging.md)
3. [单元测试](./unit-testing.md)
4. [安全规范](./security.md)
5. [MySQL 数据库](./mysql.md)
6. [工程结构](./project-structure.md)

## 参考文献

\[1\] 《阿里巴巴 Java 开发手册》，1.3.0 终极版，2017 年。

[查看原手册发布页](https://developer.aliyun.com/special/tech-java)

## 附 2：本手册专有名词

1. **`POJO`**（ `Plain Ordinary Java Object`） : 在本手册中，`POJO` 专指只有 `setter / getter / toString` 的简单类，包括 `DO/DTO/BO/VO` 等。

2. **`GAV`**（`GroupId`、`ArtifactctId`、`Version`） `: Maven` 坐标，是用来唯一标识 `jar` 包。

3. **`OOP`**（`Object Oriented Programming`） : 本手册泛指类、对象的编程处理方式。

4. **`ORM`**（`Object Relation Mapping`） : 对象关系映射，对象领域模型与底层数据之间的转换，本文泛指 `iBATIS, mybatis` 等框架。

5. **`NPE`**（`java.lang.NullPointerException`） : 空指针异常。

6. **`SOA`**（`Service-Oriented Architecture`）: 面向服务架构，它可以根据需求通过网络对松散耦合的粗粒度应用组件进行分布式部署、组合和使用，有利于提升组件可重用性，可维护性。

7. **一方库** : 本工程内部子项目模块依赖的库（`jar`包）。

8. **二方库** : 公司内部发布到中央仓库，可供公司内部其它应用依赖的库（`jar`包）。

9. **三方库** : 公司之外的开源库（`jar`包）。

10. **`IDE`**（`Integrated Development Environment`） : 用于提供程序开发环境的应用程序，一般包括代码编辑器、编译器、调试器和图形用户界面等工具，本《手册》泛指 `IntelliJ IDEA`和 `eclipse`。
