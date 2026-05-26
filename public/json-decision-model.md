# JSON Decision Model (JDM)

`GoRules JDM`（JSON 决策模型）是一个建模框架，旨在简化决策模型的表示和实现。

## 概念
作为其核心，`GoRules JDM`是围绕决策模型的概念，以`JSON`格式存储的互连图。这些图表捕获了`GoRules ZEN Engine`中各种决策点、条件和结果之间的复杂关系。

![](/images/jsongraph.png)


`Graph`是通过将节点与边连接起来而形成的，这些边就像将信息从一个节点移动到另一个节点（通常是从左到右）的路径。

输入节点充当与上下文相关的所有数据的入口，而输出节点则产生决策过程的结果。数据的传输遵循从输入节点到输出节点的路径，遍历其间所有互连的节点。当数据流经该网络时，它会在每个节点处进行评估，并且连接决定数据沿着图传递的位置。

要查看`JDM Graph`的实际效果，您可以使用免费[在线编辑器](https://editor.gorules.io/)或者[BRDE](https://brdeadmin.geetest.com/)。


## 节点 (Nodes)

除了图输入节点（Request）和输出节点（Response）之外，还有 5 种主要节点类型：

+ 决策表节点  (Decision Table Node)
+ 分支交换节点    (Switch Node)
+ 表达式节点  (Expression Node)
+ 自定义节点 (Customer Node)
+ 函数节点    (Function Node)
+ 决策节点   （Decision Node）


###  决策表节点 (Decision Table Node)
#### 概述
表格提供了决策过程的结构化表示，允许开发人员和业务用户以清晰简洁的方式表达复杂的规则。



![](/images/decide_table.png)



#### 结构 （Structure）
决策表的核心是它用输入和输出定义结构的模式。输入使用`ZEN表达式语言`实现一些业务友好型的表达式，融合一系列条件，例如相等、数字比较、布尔值、日期时间函数、数组函数等。该模式的输出规定了决策表生成的结果的形式。输入和输出通过对用户友好的界面表示，类似于通常的电子表格。这有助于轻松的修改和添加规则，使业务用户能够为决策逻辑做出贡献，而无需深入研究复杂的代码。

#### 求值流程 （Evaluation Process）
决策表从上到下逐行评估，遵循指定的命中策略。单行通过输入列从左到右进行评估。每个输入列代表 AND 运算符。如果单元格为空，则该列将被真实评估，与值无关。

如果行中的单个单元格失败（由于错误或其他原因），则跳过该行。

**命中策略**

命中策略根据匹配规则确定结果计算。

评估结果为：

+ 如果决策表的命中策略是`first`和规则匹配，则结果为对象。该结构由输出字段定义。内部带有点 (.) 的限定字段名称会生成嵌套对象。
+ 如果`first`命中策略中没有匹配的规则，则结果为`null/undefined`
+ 如果决策表的命中策略是`collect`(每个匹配规则对应一个数组项),则结果为对象数组， 如果没有规则匹配则为空数组。


#### 输入 (Inputs)

在规则或行的评估中，输入列体现了 AND 运算符。这些值通常由（限定）名称组成，例如 customer.country 或 customer.age。

输入的评估有两种类型：`Unary`和`Expression`。

**Unary**

当我们想要分别比较传入上下文中的单个字段时，通常使用`Unary`，例如 day_of_week和 drive_time，也支持使用 `.` 去访问多个层级的属性，如 other.attr(值为v1)。当列的架构中定义了`field`时，它会被启用。

**例子**

输入
```c
{
  "day_of_week": 2,
  "end_num": 5,
  "drive_time": "08:00"，
  "other":{
      "attr": "v1"
  }
}
```

![](/images/decide_table.png)

这个决策流程可等价于：
```c
IF day_of_week == 1 AND end_num in [4,9] and 在七点在22点之间 THEN {"result": "禁止通行"}
ELSE IF day_of_week == 2 AND end_num in [5,0] and 在七点在22点之间 THEN {"result": "禁止通行"}
ELSE IF day_of_week == 3 AND end_num in [1,6] and 在七点在22点之间 THEN {"result": "禁止通行"}
ELSE IF day_of_week == 4 AND end_num in [2,7] and 在七点在22点之间 THEN {"result": "禁止通行"}
ELSE IF day_of_week == 5 AND end_num in [3,8] and 在七点在22点之间 THEN {"result": "禁止通行"}
ELSE {"result": "可以通行"}
```



列表列举了输入字段中`Unary`的基础示例：

| Input entry | Input Expression  | 
| --- | --- |
| "A"   | 该字段等于“A”  |
| "A", "B"   | 该字段是“A”或“B”  |
| 36   | 数值等于36  |
| < 36   | 数值小于36  |
| > 36   | 数值大于36  |
| [20..39]   | 20到39之间的值(闭区间)  |
| true   | 布尔值 true  |
| false   | 布尔值 false  |
|    | 任何值，包括 null/undefined  |
| null   | 值为null 或 undefined  |

如需完整列表，请访问[ZEN表达式语言](https://brdeadmin.geetest.com/manual/doc)。

**Expression**

当我们想在单个单元格内创建更复杂的求值逻辑时，可以使用表达式求值。它允许我们比较同一单元格内传入上下文的多个字段。

在定义决策表的列的定义中 `Selector` 表示对上下文(context)进行变量选择或者表达式转化。
不指定  `Selector` 文本框就可以在每一行的单元格的表达式中使用任意的字段和函数。

**例子**

![](/images/decision_table_expression.png)

如此例子所示， 车牌号最后一位数字(end_num 字段)在 `Selector` 中指定了 end_num 字段, 而在driver_time 字段中并没有指定 `Selector`，这样需要再下面的表达式行中指定所需要的字段。

如需完整列表，请访问[ZEN表达式语言](https://brdeadmin.geetest.com/manual/doc)。


#### 输出 (Outputs)

输出列充当评估期间满足条件时决策表将生成的数据的蓝图。

当决策表中的一行满足其指定条件时，输出列确定将返回的信息的性质和结构。每个输出列代表一个不同的字段，这些字段的集合形成与已验证行关联的输出或结果。这种机制允许决策表精确定义和控制数据输出。

**例子**

![](/images/output.png)

结果是：
```c
{
  "flatProperty": "A",
  "output": {
    "nested": {
      "property": "B"
    },
    "property": 36
  }
}
```


###  Switch节点 (Switch Node)

JDM 中的`Switch`节点向决策模型引入了动态分支机制，使图能够根据条件发散。

条件是用 ZEN表达式语言编写的。

通过合并 Switch 节点，决策模型变得更加灵活和上下文感知。在需要基于不同输入的不同决策逻辑的场景中，此功能特别有价值。 Switch 节点有效地管理图中的分支，增强决策模型的整体复杂性和现实性，使其成为构建智能和自适应系统的关键组件。

Switch节点保留传入的数据而不做任何修改；它将整个上下文转发到输出分支。

![](/images/switch.png)


**命中策略**

Switch节点有两个命中策略选项，`first`和`collect`。

在`first`命中策略的上下文中，图分支到初始匹配条件，类似于在表中观察到的行为。相反，在`collect`命中策略下，该图扩展到条件成立的所有分支，从而允许分支到多个路径。

注意：如果同一条件有多个边缘，则不保证执行顺序。



###  函数节点 (Functions Node)

函数节点是`JavaScript`片段，允许使用`JavaScript`快速轻松地解析、重新映射或以其他方式修改数据。节点的输入作为函数的参数。函数在`ZEN Engine`内置的`Google V8`引擎隔离之上执行。

函数超时设置为 50ms。
```c
const handler = (input, {dayjs, Big}) => {
    return {
        ...input,
        someField: 'hello'
    };
};
```
有两个内置库：
+ dayjs - 用于日期操作
+ big.js - 用于任意精度的十进制算术


###  表达式节点 (Expression Node)

表达式节点用作使用`ZEN表达式语言`将输入对象转换为替代对象的工具。指定输出属性时，每个属性都需要单独的行。这些行由两个字段定义：


+ Key - 输出属性的限定名称
+ Value - 通过ZEN表达式语言表达的价值

注意：表达式节点中的任何错误都会导致图表停止。

![Alt text](/images/expression_node.png)


###  决策节点 (Decision Node)(todo)

“Decision”节点旨在扩展决策模型的功能。其功能是在执行过程中调用和重用其他决策模型。

通过合并“Decision”节点，开发人员可以模块化决策逻辑，从而提高复杂系统的可重用性和可维护性。
