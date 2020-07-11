# 注解

- **@Bean**：

- **@Controller**：对象变为Web Controller，是一个MVC类，用来负责处理Web请求，通常和@RequestMapping一起用。

- **@PathVariable**

- **@ResponseBody**：此方法返回的是文本而不是视图名称，将直接返回对象到客户端，字符串则直接输出，不是则使用Jackson序列化后输出。

- **@Repository**：声明类为数据库或者其它NoSQL访问类

- **@RequestMapping**：请求路径匹配，被注解的方法被调用，参数path，method。简化后的注解有，**@GetMapping**、**@PostMapping**、**@PutMapping**、**@DeleteMapping**、**@PatchMapping**。

  - **value**，请求的URL 的路径，支持U也模板、正则表达式。

    路径匹配：Ant路径表达式，以及用{}匹配路径变量，用\${}获得系统值。

  - **method**, HTTP 请求方法，有GET 、POST 、PUT 等。

    - *GET*，用来获取URL 对应的内容。
    - *POST*， 用来向服务器提交信息。
    - *HEAD*，同GET ，但不返回消息体，通常用于返回URL 对应的元信息，如过期时间等。搜索引擎通常用HEAD 来获取网页信息。
    - *PUT*， 同POST ，用来向服务器提交信息，但语义上更像一个更新操作。同一个数据，多次PUT 操作，也不会导致数据发生改变。而POST 在语义上更类似新增操作。
    - *DELETE*，删除对应的资源信息。
    - *PATCH*， 类似PUT 方法， 表示信息的局部更新。

  - **consumes**，允许的媒体类型（Media Types），如consumes ＝ "application/ison"， 对应于请求的HTTP 的Content-Type。

  - **produces**，相应的媒体类型，如produces ＝"application/json"， 对应于HTTP 的Accept字段。

  - **params**， 请求的参数，如params ＝"action=update" 。可以判断不存在某个参数或者参在或者参数等于某个固定值。

  - **headers**， 请求的HTTP 头的值，如headers ＝ "myHeader=myValue"。可以判断不存在某个参数或者参在或者参数等于某个固定值。

- **@RestController**

  ```java
  @Controller
  public class HelloworldController {
  	@RequestMapping("/hello")
  	public @ResponseBody String say(String name) {
      	return "hello" +name;
  	}
  }
  ```

- **@Service**：声明类为业务处理类，通常和@Transactional一起使用。

- **@Component**：Spring管理类

- **@Configuration**：配置类，通常与注解@Bean配合使用

- **@Autowired**