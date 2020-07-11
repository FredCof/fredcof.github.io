# Spring

IoC（控制反转）管理Bean, AOP（面向切面）方式增强Bean功能
## Spring IoC容器和AOP

**IoC Core Container**：负责管理对象，通过对象描述对对象初始化以及加强。

例如：

- @Controller：对象变为Web Controller, 用来负责处理Web请求，@RequestMapping：请求路径匹配，被注解的方法被调用。

  ```java
  @Controller
  public class HelloworldController {
  	@RequestMapping("/sayhello.html")
  	public @ResponseBody String say(String name) {
      	return "hello" +name;
  	}
  }
  ```

**AOP**：通过预编译方式或者运行时刻对目标动态的添加功能。比如要实现用户访问控制，可以对每个Controller 的方法使用一个自定义的注解Function ，用SpringA OP向Controller 每个方法动态地添加用户权限校验功能，类似如下：

```java
@RequestMapping("/sayhello.html")
public @ResponseBody String say (String name) {
	return "hello" +name ;
}

@RequestMapping("/adduser.html")
@Function("user.add")
public @ResponseBody String addUser (String name) {
	......
}
```
此处是个举例，不用理解。
```java
@Configuration	// 注解成功引起Sping Container注意
@Aspect	// 声明为AOP类
public class RoleAccessConfig {
    @Around("within(@org.springframework.stereotype.Controller * ) && @annotation(function)")
    public Object functionAccessCheck(final ProceedingJoinPoint pjp, Function function) throws Throwable {
        if (function ! =null ) {
            String functionName = function.value();
            if(!canAccess(functionName)) {
                MethodSignature ms= (MethodSignature) pjp.getSignature();
                throw new RuntimeException("Can not Acces s" + ms.getMethod());
            }
        }
        // 继续处理原有的调用
        Object o = pjp.proceed();
        return o;
    }
    
    protected boolean canAccess(String functionName) {
        if(functionName.length()==0) {
            // 总是允许访问
            return true;
        }else{
            // 取出当前用户对应的所有角色，从数据库中查询角色是否有访问functionName的权限
            return false;
        }
    }
}
```

## Spring的缺点

1. ~~使用门槛升高， 要入门Spring 需要较长时间。~~
2. 对过时技术兼容， 导致使用复杂度升高。
3. XML 配置已经不是流行的系统配置方式。
4. ~~集成第三方工具时候，程序员还要考虑工具之间的兼容性。~~
5. 系统启动慢，不具备热部署功能，完全依赖虚拟机或者We b 服务器的热部

1和4在Spring Boot中被解决