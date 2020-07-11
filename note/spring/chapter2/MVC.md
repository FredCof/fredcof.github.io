# MVC

首先是目录结构：

Web 的模板文件位于resources/templates 目录下，模板文件使用的静态资源文件，如JS 、
css 、图片，存放在resources/static 目录下。

## @RequestMapping和@Controller

参见[附录/注解符](/appendix/annotations.md)

## 方法参数

- **@PathVariable**，可以将URL 中的值映射到方法参数中。可以是类前和方法先的路径匹配，自动对应同名参数，不同名可以用@PathVariable("id")来对应不同名的参数。

- **Model**，Spring 中通用的MVC 模型，也可以使用Map 和ModelMap 作为渲染视图的模型。

  在方法的参数中使用如下：

  ```java
  @GetMapping(path = "/{userid}/get.html")
  public String getUser(@PathVariable Long userid, Model model) {
      User userInfo = userService.getUserById(userid);
      // model.addAttribute(userinfo) 与下面代码效果相同
      // 但是这个方法声明会在之后的代码重构中出现错误，建议使用下面一种
      model.addAttribute("user", userinfo);
      return "/userinfo.html";
  }
  ```

  在模板中使用模型中的数据如下：

  ``````html
  <html>
      <body>
          ${user.id}<br/>${user.name}
      </body>
  </html>
  ``````

  - *Model addAttribute(String attributeName, Object attributeValue)*，向模型添加一个变量，attributeName 指明了变量的名称，可以在随后的视图里引用， attributeValue 代表了变量。
  - *Model addAttribute (Object attributeValue)*， 向模型添加一个变量，变量的名字就是其类名字首字母小写后转为的Java 变量。
  - *Model addAllAttributes(Map attributes)*，添加多个变量，如果变量已经存在，则覆盖。
  - *Model mergeAttributes(Map attributes)*，添加多个变量， 如果变量己经存在于模型中，则忽略。
  - *Model addAllAttributes(Collection<?> attributeValues)*， 添加多个变量，变量来自于集合的元素， 变量命名规范同时addAttribute(Object attributeValue) 。
  - *boolean containsAttribute(String attributeName)*， 判断是否存在变量。

- **ModelAndView**，包含了模型和视图路径的对象。

  ```java
  @GetMapping(path = "/{ userid}/get2.html")
  public ModelAndView getUser2(@PathVariable Long userid, ModelAndView view) {
  // 也可以如下声明：
  // public ModelAndView getUser2(@PathVariable Long userid) {
  //		ModelAndView view = new ModelAndView();
      User userinfo = userService.getUserById (userid);
      view.addObject("user",userinfo);
      view.setViewName("/userinfo.html");
      return view;
  }
  ```

- **JavaBean**，将HTTP 参数映射到JavaBean 对象。

  ```java
  public String getUser2(@RequestParam(value="id", required=true, defaultValue="") Integer id, String name)
  ```

  其中复杂的映射如下：

  ```html
  <form action="/javabean/saveOrder.json" method="post">
      订单名称：<input name="order.name"/><br/>
      订单明细1：<input name="details[0].name"/><br/>
      订单明细2：<input name="details[1].name"/><br/>
      <input type="submit" value="Submit"/>
  </form>
  ```

  ```java
  // 模型代码
  public class OrderPostForm {
      private Order order;
      private List<OrderDetail> details;
      // 忽略getter和setter
  }
  
  // Controller代码
  @PostMapping(path="./saveorder.json")
  @ResponseBody
  public String saveOrder(OrderPostForm form) {
      return "Success";
  }
  ```

  ```ini
  spring.servlet.multipart.enabled=true
  # 设定上传的文件超过一定长度之后写道零时文件中，0则没有阈值
  spring.servlet.multipart.file-size-threshold=0
  # 零时文件存放目录，不设定则由Web服务器提供
  spring.servlet.multipart.location=
  # 单个文件的最大尺寸
  spring.servlet.multipart.max-file-size=1MB
  # 单次请求的最大尺寸
  spring.servlet.multipart.max-request-size=10MB
  # 当文件和参数被访问的时候再解析为文件
  spring.servlet.multipart.resolve-lazily=false
  ```

  其中回自动将html中的name属性对应到模型中对应的属性，例如order.name对应order属性的name属性，方括号对应List对应位置的元素。一定要是List不可以是Set。

- **MultipartFile**，用于处理文件上传。

  提供的对文件信息获取的方法：

  - *getPriginalFilename*，获取上传文件的民字；
  - *getBytes*，获取上传文件内容，转为字节数组；
  - *getInputStream*，获取一个InputStream；
  - *isEmpty*，文件上传内容为空，或者没有文件上传；
  - *getSize*，文件上传的大小；
  - *transferTo(File dest)*，保存上传文件到目标文件系统；

  ```java
  @PostMapping("/form")
  @ResponseBody
  public String handleFormUpload(String name, MultipartFile[] files) throws IOException {
      return "Success";
  }
  ```

  对应的html中有多个名为files的文件

  ```html
  <form action= "/form" method="post" enctype="multipart/form-data">
      选择文件： <input type="file" name="files"><br/>
      选择文件： <input type="file" name="files"><br/>
      选择文件： <input type="file" name="files"><br/>
      <input type="submit" value="Submit">
  </form>
  ```

- **@ModeIAtribute**，使用该注解的变量将作为Model 的一个属性。

  ```java
  @ModelAttribute
  public void findUserByid(@PathVariable Long id, Model model) {
      model.addAttribute("user", userService.getUserByid(id));
  }
  
  // 如果需要注入的属性只有一个等同下面的写法
  @ModelAttribute
  public void findUserByid(@PathVariable Long id) {
      return userService.getUserByid(id);
  }
  
  @GetMapping(path = "/{id)/get.json")
  @ResponseBody
  public String getUser(Model model) {
      System.out.println(model.containsAttribute("user"));
      return "success";
  }
  ```

- **WebRequest**或者**NativeWebRequest**，类似Servlet Request ，但做了一定封装。

- **java.io.InputStream** 和**java.io.Reader**，用来获取Servlet API 中的lnputStream/Reader 。

- **java.io.OutputStream** 和**java.io.Writer**，用来获取Servlet API 中的OutputStream/Writer 。

- **HttpMethod**， 枚举类型， 对应于HTTP Method ，如POST 、GET。

- **@MatrixVariable**，矩阵变量。

- **@RequestParam**， 对应于HTTP 请求的参数，自动转化为参数对应的类型。

- **@RequestHeader**，对应于HTTP 请求头参数，自动转化为对应的类型。

- **@RequestBody**， 自动将请求内容转为指定的对象， 默认使用HttpMessageConverters来转化。同时也说明HTTP的消息体是一个JSON，转化为指定的对象。

  ```java
  @PostMapping(path="/savejsonorder.json")
  @ResponseBody
  public String saveOrderByJson(@RequestBody User user) {
      return user.getName();
  }
  ```

- **@RequestPart**，用于文件上传，对应于HTTP 协议的multipart/form-data 。

- **@SessionAttribute**， 该方法标注的变量来自于Session 的属性。

- **@RequestAttribute**，该标注的变量来自于request 的属性。

- **@InitBinder**，用在方法上，说明这个方法会注册多个转化器，用来个性化地将HTTP请求参数转化成对应的Java 对象，如转化为日期类型、浮点类型、JavaBean 等，当然，也可以实现WebBindinglnitializer 接口来用于Spring Boot 应用所需要的dataBinder 。

  ```java
  @Controller
  public class MyFormController {
      @InitBinder
      protected void initBinder(WebDataBinder binder) {
          binder.addCustomFormatter(new DateFormatter("yyyy-MM-dd"));
      }
      
      @ResponseBody
      @RequestMapping("/date")
      // databind/date?d=2011-1-1
      public void printDate(Date d) {
          System.out.println(d);
          return;
      }
  }
  ```

- **BindingResult** 和**Errors**， 用来处理绑定过程中的错误。