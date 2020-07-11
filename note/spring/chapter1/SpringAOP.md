# Spring AOP

> Aspect-Oriented Programming，面向切面编程

应用可以在运行时刻动态地在方法调用前后“织入”一些公共代码，从而提供系统的公共服务。类似Python3中的函数修饰符。

AOP 有如下术语：

1. **Aspect**：Aspect 声明类似于Java 中的类声明，在Aspect 中会包含一些Pointcut 及相应的Advice。
2. **Joint point** ： 表示在程序中明确定义的点，典型的包括方法调用、对类成员的访问， 以及异常处理程序块的执行等。Spring 中的Joint point 只支持方法调用。
3. **Pointcut** ： 表示一组Joint point ， 如方法名、参数类型、返回类型等，这些Joint point 通过逻辑关系组合起来， 它定义了相应的Advice 将要发生的地方。简单理解Pointcut（ 一种表达式）一一用来判断在Joint point （方法调用）中执行Advice （操作）。
4. **Advice**：Advice 定义了在Pointcut 里面定义的程序点具体要做的操作， 它通过before 、around 、after ( return 、throw 、finally ）来区别是在每个Joint point 之前、之后还是执行前后要调用的代码。
   - **before** ： 在执行方法前调用Advice ，比如cache 功能可以在执行方法前先判断是否有缓存。
   - **around** ： 在执行方法前后调用Advice ， 这是Spring 框架和应用系统一种最为常用的方法， 参见[第一章Spring](Spring.md)。
   - **after** ： 在执行方法后调用Advice, after return 是方法正常返回后调用， after throw是方法抛出异常后调用。
   - **finally** ： 方法调用后执行Advice ， 无论是否抛出异常还是正常返回。
5. **AOP proxy**：AOP Proxy 也是Java 对象，由AOP 框架创建， 用来完成上述的动作， AOP对象通常可以通过JDK dyamic proxy 完成，或者使用CGLib 完成。
6. **Weaving** ： 实现上述切面编程的代码织入， 可以在编译时刻（通过AspectJ compiler ) ，也可以在运行时刻， Spring 和其他大多数Java 框架都是在运行时刻生成代理。