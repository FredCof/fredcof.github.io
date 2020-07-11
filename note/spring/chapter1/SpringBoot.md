# Spring Boot

## 系统级服务

Spring Boot通过Starter提供系统级服务，下表是Spring Boot提供的Starter：

| 名称                                   | 作用                                                     |
| -------------------------------------- | -------------------------------------------------------- |
| spring-boot-starter-web                | Web开发支持， 默认使用Tomcat8                            |
| spring-boot-starter-aop                | AOP 开发支持，使用AspectJ                                |
| spring-boot-starter-jdbc               | Spring JDBC                                              |
| spring-boot-starter-data-jpa           | JPA 方式访问数据库，使用Hibernate 作为JPA 实现           |
| spring-boot-starter-data-elasticsearch | 集成Elasticsearch ，默认访问localhost:9200               |
| spring-boot-starter-data-redis         | 集成Redis ，使用JRedis ，默认连接localhost:6379          |
| spring-boot-starter-cache              | 缓存， 支持多种缓存方式，如本地的、Redis 、Ehcache 等    |
| spring-boot-devtools                   | 应用程序快速重启的工具，提升开发体验                     |
| spring-boot-starter-data-mongodb       | 集成MongoDB ，默认访问mongodb://localhost/test           |
| spring-boot-starter-data-neo4j         | 集成neo4j ， 默认访问localhost:7474                      |
| spring-boot-starter-data-gemfire       | 集成分布式缓存                                           |
| spring-boot-starter-data-soIr          | 基于Apache lucene的搜索平台，默认访问localhost:8983/solr |
| spring-boot-starter-data-cassandra     | 集成Cassandra，默认访问localhost:7474                    |
| spring-boot-stater-data-ldap           | 集成ldap                                                 |
| spring-boot-starter-activemq           | 消息集成ActiveMQ 支持                                    |
| spring-boot-starter-amqp               | 消息集成AMQP 协议支持，如支持RabbitMQ                    |
| spring-boot-starter-jta-atomikos       | 分布式事务支持，使用atomikos                             |
| spring-boot-stater-jta-bitronix        | 一个开源的分布式事务支持                                 |
| spring-boot-starter-test               | 包含JUnit 、Spring Test、Hamcrest 、Mockito 等测试工具   |
| spring-boot-starter-webservices        | webservice 支持                                          |
| spring-boot-starter-websocket          | websocket 支持                                           |
| spring-boot-starter-jersey             | REST 应用和Jersey 支持                                   |
| spring-boot-starter-freemarker         | Freemaker 支持                                           |

## 优点

- 实现约定大于配置，是一个低配置的应用系统框架。不像Spring 那样“地狱般的配置体验”， Spring Boot 不需要配置或者极少配置，就能使用Spring 大量的功能。
- 提供了内置的Tomcat 或者Jetty 容器。
- 通过依赖的jar 包管理、自动装配技术，容易支持与其他技术体系、工具集成。
- 支持热加载，开发体验好。也支持Spring Boot 系统监控，方便了解系统运行状况。