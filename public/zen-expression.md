# Expression Language


`zen expression` 是一个业务优先的表达式语言, 提供优异的性能和简单的可读性, 期待弥合业务分析师和工程师之间的认知偏差。根据表达式的内容和使用的位置, 表达式可以分为两种模式:

- **unary test**
- **expression**

大多数时候, 你将会在决策表的表格中写 unary test(以逗号分隔的列表).
## 一元运算符(Unary test)

一元运算符是一个逗号分隔的简单表达式列表，每个逗号分隔符都被视为`or`运算符, 其计算结果为**布尔**值。在一元表达式中，有一个特殊符号可 `$`用于引用当前列。

> 如果`$`在列中引用，一元运算符将变成**表达式模式**。

```c
// Given: $ = 1
1, 2, 3      // true
1            // true
>= 1         // true
< 1          // false
[0..10]      // true, (internally this is $ >= 0 and $ <= 10)
> 0 and < 10 // true

// Given: $ = 'USD'
'GBP', 'USD'          // true
'EUR'                 // false
startsWith($, "US")   // true - defaults to expression mode, comma is unavailable
endsWith($, "US")     // false - defaults to expression mode
lower($) == "usd"     // true - defaults to expression mode
```

## 表达式(Expression)


表达式具有 ZEN 语言的全部语法功能。它们使您可以访问所有函数，并且在定义列或输出时非常有用。使用时，完整语法在`$`单元表达式中也可用（因为它强制使用表达式模式）。

```c

100 + 100                              // 200
10 * 5                                 // 50
10 ^ 2                                 // 100
1 in [1, 2, 3]                         // true
5 in (5..10]                           // false
sum([1, 2, 3])                         // 6
max([1, 2, 3])                         // 3
"hello" + " " + "world"                // "hello world"
len("world")                           // 5
weekdayString(date("2022-11-08"))      // "Tue"
contains("hello world", "hello")       // true
upper('john')                          // "JOHN"
some(['admin', 'user'], # == "admin")  // true
not all([100, 200, 400, 800], # in (100..800)) // false
filter([100, 200, 400, 800], # >= 200) // [200, 400, 800]

```

# 数据类型

每种数据类型都可以定义自己的一组运算符和内置函数。数据类型定义如下:


## 字符串(String)

字符串是一种表示文本内容（字符列表、单词）的数据类型。它通过使用单引号`'`或双引号括住字符来定义`"`。

以下所有示例均有效：

```c
"double quote string";
'single quote string';
```

### 字符串操作符

#### 字符串操作符

| 操作符 | 描述    | 例子    |
| --- | ----- | ----- |
| +   | 字符串连接 | a + b |

#### 比较操作符

| 操作符 | 描述  | 例子     |
| --- | --- | ------ |
| ==  | 等于  | a == b |
| !=  | 不等于 | a != b |

### 函数

#### len

接受一个字符串并返回其中的字符数。

```c
len('string') // 6  返回值为int
```

#### upper

接受一个字符串并返回它的大写版本。

```c
upper('string') // "STRING"  返回值为str
```

#### lower

接受一个字符串并返回其小写版本。

```c
lower('StrInG') // "string" 返回值为str
```

#### startsWith

接受两个参数，如果字符串以指定值开头，则返回 true。

```c
startsWith('Saturday night plans', 'Sat') // true   返回值为bool
startsWith('Saturday night plans', 'Sun') // false  返回值为bool
```

#### endsWith

接受两个参数，如果字符串以指定值结尾，则返回 true。

```c
endsWith('Saturday night plans', 'plans') // true   返回值为bool
endsWith('Saturday night plans', 'night') // false  返回值为bool
```

#### contains

接受两个参数，如果字符串包含指定值则返回 true。

```c
contains('Saturday night plans', 'night') // true    返回值为bool
contains('Saturday night plans', 'urday') // true    返回值为bool
contains('Saturday night plans', 'Sunday') // false  返回值为bool
```

#### matches

接受两个参数，如果字符串与正则表达式匹配则返回 true。

```c
matches('12345', '^\d+$') // true   返回值为bool
matches('1234a', '^\d+$') // false  返回值为bool
```

#### extract

接受两个参数，返回正则表达式中捕获组的数组。

```c
extract('2022-02-01', '(\d{4})-(\d{2})-(\d{2})') // ["2022-02-01", "2022", "02", "01"]  返回值为array
extract('foo.bar', '(\w+).(\w+)') // ["foo.bar", "foo", "bar"]                          返回值为array
```

#### string

接受一个参数，尝试将变量转换为字符串，失败时抛出错误

```c
string('abc')  // "abc"   返回值为str
string('20')   // "20"    返回值为str
string(20)     // "20"    返回值为str
string(true)   // "true"  返回值为str
```



## 数字(Number)

数字可以是整数（整数）或小数（浮点数）。可以使用数字`0-9`, `.`（小数分隔符）和来定义, 使用`_`为了便于阅读。

以下所有示例均有效：

```c
100;
1_000_000;
1.54;
```

> **在内部，数字使用双精度**浮点表示。

### 数字操作符

### 一元操作符

| 操作符 | 描述  | 例子  |
| --- | --- | --- |
| -   | 取负数 | -a  |

### 算术运算

所有算术运算符都遵循自然数学优先级。例如`(a + b) * c`不同于`a + b * c`。

| 操作符 | 描述  | 例子    |
| --- | --- | ----- |
| +   | 加法  | a + b |
| -   | 减法  | a - b |
| *   | 乘法  | a * b |
| /   | 除法  | a / b |
| ^   | 指数  | a ^ b |
| %   | 取余  | a % b |

### 比较操作符

| 操作符 | 描述   | 例子     |
| --- | ---- | ------ |
| ==  | 等于   | a == b |
| !=  | 不等于  | a != b |
| <   | 小于   | a < b  |
| >   | 大于   | a > b  |
| <=  | 小于等于 | a <= b |
| >=  | 大于等于 | a >= b |

### 函数

#### abs

接受一个数字，并返回其绝对值。

```c
abs(-1.23) // 1.23
abs(10) // 10
```

#### rand

接受一个正数（限制），并返回 1 和提供的限制之间的生成数字。

```c
rand(100) // 返回包含1到100之间的随机数，包含1和100  返回值为int
rand(2) // 返回随机数1或者2 返回值为int
```

#### floor

接受一个数字并将其向下舍入。它返回小于或等于给定数字的最大整数。

```c
floor(5.0)  // 5    向下取整  返回值为int
floor(5.12) // 5    向下取整  返回值为int
floor(5.9)  // 5    向下取整  返回值为int
```

#### round

接受一个数字并将该数字四舍五入为最接近的整数。

```c
round(5.0)  // 5  四舍五入  返回值为int
round(5.1)  // 5  四舍五入  返回值为int
round(5.49) // 5  四舍五入  返回值为int
round(5.5)  // 6  四舍五入  返回值为int
round(5.9)  // 6  四舍五入  返回值为int
```

#### ceil

接受一个数字并将其向上舍入。它返回大于或等于给定数字的最小整数。

```c
ceil(5.0) // 5  向上取整  返回值为int
ceil(5.1) // 6  向上取整  返回值为int
ceil(5.9) // 6  向上取整  返回值为int
```

#### number

接受一个参数，尝试将数字或字符串转换为数字，失败时抛出错误

```c
number('20')  // 20  返回值为int
number(20)    // 20  返回值为int
number(true)  // 1   返回值为int
number(false) // 0   返回值为int
```

注意：在决策表中建议`number`与结合使用`isNumeric`，这样可以防止表达式失败导致行被跳过。例如`isNumeric($) && number($)`。



#### isNumeric

接受一个参数，返回 bool，如果变量是数字或可以转换为数字的字符串则返回 true。

```c
isNumeric('20')   // true   返回值为bool
isNumeric('test') // false  返回值为bool
isNumeric(true)   // false  返回值为bool
```


## 布尔(Boolean)

布尔是一种逻辑数据类型，可以是**true**也可以是**false**。
### 布尔操作符

#### 逻辑运算符

| 操作符 | 描述             | 例子     |
| --- | -------------- | ------ |
| and | 与(Conjunction) | a == b |
| or  | 或(Disjunction) | a != b |
| !   | 非(Negation)    | !a     |
| not | 非              | not(a) |

#### 比较操作符

| 操作符 | 描述  | 例子     |
| --- | --- | ------ |
| ==  | 等于  | a == b |
| !=  | 不等于 | a != b |

#### 三元操作符

可以使用三元运算符编写一个简短的内联语句`if then else`。

```c
product.price > 100 ? 'premium' : 'value'; // if price is greater than 100 "premium" otherwise "value"
```

### 函数

#### bool

接受一个参数，尝试将变量转换为布尔值，失败时抛出错误

```c
bool(1)       // true     返回值为bool
bool(0)       // false    返回值为bool
bool(true)    // true     返回值为bool
bool(false)   // false    返回值为bool
bool('true')  // true     返回值为bool
bool('false') // false    返回值为bool
bool('abc')   // false    返回值为bool
```


## 日期和时间(Date and time)

日期、时间和持续时间是一组虚拟数据类型，内部使用 unix 时间戳（数字）表示为数字。

### 日期时间操作符

请阅读[数字操作符](zen-expression.md#数字操作符)

### 日期时间函数

#### date

接受格式化的字符串作为输入并以秒为单位返回 unix 时间戳。

```c
date('now')                   // 当前时间戳    
date('2022-01-01')            // 1640995200  2022-01-01对应的时间戳
date('2022-04-04T21:48:30Z')  // 1649108910  2022-04-04T21:48:30Z对应的时间戳
// date('yesterday')          // 语法不支持
```

#### time

接受格式化的字符串作为输入并返回表示午夜(midnight)秒数的数字。

```c
time('21:49')                 // 78540  从0时开始到21:49之间的秒数
time('21:48:20')              // 78500  从0时开始到21:48:20之间的秒数
time('2022-04-04T21:48:30Z') // 78510  从0时开始到21:48:30之间的秒数
```

#### duration

接受格式化的字符串（从秒到小时）作为输入并以秒为单位返回持续时间。

```c
duration('1h')  // 3600    1小时包含的秒数
duration('30m') // 1800   30分钟包含的秒数
duration('10h') // 36000  10小时包含的秒数 
```

#### dayOfWeek

接受时间戳并以数字形式返回星期几。

```c
dayOfWeek(date('2022-11-08')) // 2   返回值为int
```

#### dayOfMonth

接受时间戳并以数字形式返回月份中的日期。

```c
dayOfMonth(date('2022-11-09')) // 9  返回值为int
```

#### dayOfYear

接受时间戳并以数字形式返回一年中的某一天。

```c
dayOfYear(date('2022-11-10')) // 314  返回值为int
```

#### weekOfMonth

接受时间戳并以数字形式返回月份的周数。

```c
weekOfMonth(date('2022-11-11')) // 2  返回值为int
```

#### weekOfYear

接受时间戳并以数字形式返回一年中的第几周。

```c
weekOfYear(date('2022-11-12')) // 45  返回值为int
```

#### seasonOfYear

接受 unix 时间戳并以字符串形式返回一年中的季节。

```c
seasonOfYear(date('2022-11-13')) // Autumn  返回值为str
```

#### monthString

接受时间戳并以字符串形式返回月份。

```c
monthString(date('2022-11-14')) // Nov  返回值为str
```

#### weekdayString

接受时间戳并以字符串形式返回星期几。

```c
weekdayString(date('2022-11-14')); // Mon  返回值为str
```

#### startOf

接受时间戳和单位。根据指定单位返回日期的开始时间。
允许的单位：

| 时间单位   | 传递参数                         |
| ------ | ---------------------------- |
| Second | "s" \| "second" \| "seconds" |
| Minute | "m" \| "minute" \| "minutes" |
| Hour   | "h" \| "hour" \| "hours"     |
| Day    | "d" \| "day" \| "days"       |
| Week   | "w" \| "week" \| "weeks"     |
| Month  | "M" \| "month" \| "months"   |
| Year   | "y" \| "year" \| "years"     |

```c
startOf(date('2022-11-14 15:45:12'), 'day') // 1668384000  2022-11-14 00:00:00对应的时间戳
```

#### endOf[​](https://gorules.io/docs/user-manual/decision-modeling/expression-language/date-and-time#endof "Direct link to endOf")

接受时间戳和单位。根据指定单位返回日期的结束时间。

```c
endOf(date('2022-11-14 15:45:12'), 'day') // 1668470399 2022-11-14 23:59:59对应的时间戳
```


## 数组(Array)

Array represents a list of other data types (list of numbers, strings, booleans). It's declared by opening a square bracket, writing a list of desired data types, and closing it.

```c
['a', 'b', 'c'] // string array
[1, 2, 3]       // number array[true, false]   // boolean array
```

### 数组运算符
### 数组成员访问符

Properties in the array can be accessed using dot syntax `.key` or `[key]`.

For example:

```c
// Suppose customer.groups = ["admin", "user"]
// customer.groups.0  // "admin"   语法不支持
customer.groups[0] // "admin
customer.groups[1] // "user"
customer.groups[2] // null   超出取值索引返回为null
```

#### 数组元素关系符

| 运算符    | 描述    | 例子             |
| ------ | ----- | -------------- |
| in     | 元素包含  | a in array     |
| not in | 元素不包含 | a not in array |

#### 范围运算符

有用的大于和小于操作符的简化运算符。

| 操作符         | 等价                |
| ----------- | ----------------- |
| 闭区间         |                   |
| x in [a..b] | x >= a and x <= b |
| x in (a..b) | x > a and x < b   |
| x in [a..b) | x >= a and x < b  |
| x in (a..b] | x > a and x <= b  |
| 开区间         |                   |
| x in ]a..b[ | x <= a or x >= b  |
| x in )a..b( | x < a or x > b    |
| x in ]a..b( | x <= a or x > b   |
| x in )a..b[ | x < a or x >= b   |

### 数组函数

#### len

接受一个数组并返回其长度。

```c
len([1, 2, 3]) // 3 
```

#### sum

接受一个数字数组并返回所有元素的总和。

```c
sum([1, 2, 3])     // 6  
sum([1.1, 2.53, 3]) // 6.63
```

#### avg

接受一个数字数组并返回所有元素的平均值。

```c
avg([1, 2, 3]) // 2
```

#### min

接受一个数字数组并返回最小元素。

```c
min([1, 2, 3]) // 1
```

#### max

接受一个数字数组并返回最大元素。

```c
max([1, 2, 3]) // 3
```

#### mean

接受一个数字数组并返回平均值。

```c
mean([1, 2, 3]) // 2mean([1, 2, 3, 4]); // 2.5
```

#### mode

接受一个数字数组并返回出现最多的元素(众数)。

```c
mode([1, 1, 2, 2, 2, 5, 6, 9]) // 2
```

#### contains

接受一个数组和一个搜索参数。如果元素存在于数组中，则返回 true。

```c
contains(['a', 'b', 'c'], 'a') // true  返回值为bool
contains([1, 2, 3], 5)         // false 返回值为bool
```

#### flatten

接受数组并通过单个级别展平参数。

```c
flatten([1, 'a', ['b', 'c'], [4]])  // [1, "a", "b", "c", 4] 返回值为array
flatten([  [1, 2, 3],  [4, 5, 6],]) // [1, 2, 3, 4, 5, 6]    返回值为array
```

### 闭包函数

闭包函数允许您将回调定义为特殊参数，该参数会迭代数组的所有元素。在闭包中，您可以使用变量访问当前元素`#`。

#### all

如果数组的所有元素都满足条件，则返回 true。

```c
all(["a", "b"], # == "a")   // false   返回值为bool
all([1, 2, 3], # in [1..3]) // true    返回值为bool
```

#### some

如果数组中至少有一个元素满足条件，则返回 true。

```c
some(["a", "b"], # == "a") // true   返回值为bool
some([1, 2, 3], # > 5)     // false  返回值为bool
```

#### none

如果数组中没有元素满足条件，则返回 true。

```c
none(["a", "b"], # == "a") // false  返回值为bool
none([1, 2, 3], # > 5)     // true   返回值为bool
```

#### filter

返回一个仅包含满足条件的元素的新数组。

```c
filter([1, 2, 3, 4], # > 1) // [2, 3, 4]  返回值为array
```

#### map

返回具有重新映射值的新数组。

```c
map(["world", "user"], "hello " + #) // ["hello world", "hello user"]  返回值为array
map([1, 2, 3], # + 5)                // [6, 7, 8]                      返回值为array
```

#### flatMap

返回具有重新映射值的新数组并将其展平。

```c
flatMap([[1, 2, 3], [4, 5, 6]], map(#, # + 1)) // [2, 3, 4, 5, 6, 7]  返回值为array
```

#### count

对数组中的元素按照过滤条件计数。

```c
count([1, 2, 3], # > 1) // 2   返回值为int
```



## 上下文(Context)

Context 是一种特殊的全局数据类型，其结构与节点接收到的 JSON 输入相同。

它使用成员资格运算`.`符来访问其成员。

### 例子

如果输入收到以下内容：

```c
{  "customer": {    
       "firstName": "John",    
       "lastName": "Doe",    
       "groups": ["admin", "user"],    
       "age": 34  
    }
}
```

我们将能够全局使用以下属性：

```c
customer.firstName // "John"
customer.lastName  // "Doe"
customer.groups    // ["admin", "user"]
customer.age       // 34
```

为了将其与前面几节的知识相结合，我们可以写出如下表达式：

```c
customer.firstName + " " + customer.lastName // "John Doe"
customer.age in [30..40]                     // true
contains(customer.groups, "admin")           // true
```

> `$`也被认为是上下文的一部分，它指的是当前列（单元格内）。
