# Hello World

> 教程基于IntelliJ

1. 打开IntelliJ IDEA，选择新建项目

   ![Snipaste_2020-07-10_09-30-49](https://i.loli.net/2020/07/10/RmUS85W63AKthsT.jpg)

2. 选择Spring Initializer，此处用Default（Spring官网），点击下一步，然后输入Group以及Artifact等，其他的保持不变（可以选择一下Java Version）。

   ![image-20200710093230268](https://i.loli.net/2020/07/10/OnNGraiMpWle9FT.png)

3. 然后编写一个Controller类, 放在Controller目录下面

   ![image-20200710095200446](https://i.loli.net/2020/07/10/7c2PGxN9bd6uXIQ.png)

4. 其中UserController的代码为：

   ```java
   package top.cofal.guardianship.controller;
   
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
   
   @RestController
   @EnableAutoConfiguration
   public class UserController {
       @RequestMapping(value = "/")
       public String hello(HttpServletRequest request, HttpServletResponse response) {
           return "Hello World!";
       }
   }
   
   ```

5. 点击右上角的运行，就可以在浏览器的`http://localhost:8080/`，国内的Maven速度可能很慢，所以建议在运行钱更换国内镜像！

6. 开启热更新，方便调试，修改`pom.xml`：

   ```xaml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-devtools</artifactId>
           <optional>true</optional>
       </dependency>
   </dependencies>
   <build>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
               <configuration>
                   <fork>true</fork>
               </configuration>
           </plugin>
       </plugins>
   </build>
   ```

7. 设置IntelliJ

   1. 设置中开启自动编译

      ![image-20200710230021723](https://i.loli.net/2020/07/10/pmSHeliT7NPxL9t.png)

   2. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>/</kbd>选择Registry，设置`compiler.automake.allow.when.app.running`为勾选。