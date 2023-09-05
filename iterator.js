// 实现一个可迭代对象
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
const iterator = info[Symbol.iterator]()
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

for (const item of info) {
    if (item === '篮球') { break }
    console.log(item);
}