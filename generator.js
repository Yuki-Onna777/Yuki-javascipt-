function* generator1() {
    for (let i = 1; i <= 5; i++) {
        yield i
    }
}
const geneIterator1 = generator1()

// yield后面的值相当于value值
console.log(geneIterator1.next());
console.log(geneIterator1.next());
console.log(geneIterator1.next());
console.log(geneIterator1.next());
console.log(geneIterator1.next());

// 生成器函数中存在[Symbol.iterator]接口所以可以使用for of
for (const item of generator1()) {
    console.log(item);
}

// 生成器传参问题
function* generator2(a) {
    console.log(a);
    const b = yield 1
    console.log(b);
    const c = yield 2
    console.log(c);
    const d = yield 3
    console.log(d);
}

// 拿到生成器函数中return的特殊的迭代器
const geneIterator2 = generator2(1) /* 将1传给a */

// 真正执行函数
geneIterator2.next() /* 第一次执行函数并且执行到 yield a 后，打印a值为1，并且该next方法执行后返回{done：false，value：1} */
geneIterator2.next(2) /* 第二次执行函数并且执行到 yield b 后，将2传给b，打印b值为2，并且该next方法执行后返回{done：false，value：2} */
geneIterator2.next(3) /* 第三次执行函数并且执行到 yield c 后，将3传给c，打印c值为3，并且该next方法执行后返回{done：false，value：3} */
geneIterator2.next(4) /* 第四次执行函数，将4传给d，打印d值为4，并且该next方法执行后返回{done：false，value：4} */
geneIterator2.next()  /* 如果第五次调用next方法，next方法执行后返回{done：true，value：undefined} */

// 使用for of遍历该生成器函数时，可以发现在遍历时，是边执行了generator函数，边打印yield后的value值
// 该generator()中存在[Symbol.iterator]接口，可打印查看
for (const item of generator2(1)) {
    console.log(item); /* 实际上是输出 1 1 undefined 2 undefined 3 undefined */
}

// yield*增强语法
function* generator3() {
    console.log(7);
    yield* [1, 2, 3, 4] /* yield*后面跟一个可迭代对象 */
    yield 9
}
// for of遍历yield后的value值，如果是yield*则是可迭代对象中的每个元素做value值
for (const item of generator3()) {
    console.log(item); /* 7 1 2 3 4 9 */
}

// 对象例子
const info = {
    uname: 'yjl',
    age: 20,
    char: '篮球',
    friends: ['kobe', 'james', 'curry', 'kd'],
    adress: {
        kobe: "洛杉矶",
        team: "湖人",
        char: "4点半"
    },
    // 关键在于该对象中有iterator接口
    [Symbol.iterator]() {
        // return一个iterator对象
        let index = 0
        return {
            next: () => {
                if (index < Object.values(this).length) return { value: Object.values(this)[index++] }
                else return { done: true }
            },
            // 用于监听for of在何时中断
            return() {
                console.log('在篮球这中断了');
                return { done: true }
            }
        }

    }
}
function* generator4() {
    yield* info
}
for (const item of generator4()) {
    console.log(item); /* 和前面打印一致 */
}

// 提前使用return中断生成器函数
function* generator5(a) {
    console.log(a);
    const b = yield 1
    console.log(b);
    return 9
    yield 8
}
const geneIterator5 = generator5(7)
geneIterator5.next();  /* 返回 { value: 1, done: false } */
geneIterator5.next(8); /* 返回 { value: 9, done: true } */
geneIterator5.next();  /* 返回 { value: undefined, done: true } */
// 可以看出for of去遍历生成器函数时，会执行该函数并且只会遍历yield后面的值不会遍历得到return后的值
for (const item of generator5()) {
    console.log(item); /* undefined 1 undefined */
}
// 小注意
console.log(generator5()===geneIterator5); /* false，所以for of遍历是不能把generator5()换成geneIterator5,因为该函数是通过generator5()[Symbol.iterator]实现了iterator接口 */