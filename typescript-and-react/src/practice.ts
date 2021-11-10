// 1. 타입스크립트 연습 A - 작업환경 설정, 기본타입, 함수

let count = 0;
count += 1;
// 지정되어 있는 타입과 다른 타입으로 할당하면 에러
// count = "문자열";
// Type 'string' is not assignable to type 'number'.

const message: string = "hello world";
const done: boolean = false;

// 배열은 type[]
const numbers: number[] = [1, 2, 3];
const messages: string[] = ["hello", "world"];
// 지정되어 있는 타입과 다른 타입으로 원소를 추가했을 때 에러
// messages.push(1);
// Argument of type 'number' is not assignable to parameter of type 'string'.

let mightBeUndefined: string | undefined = undefined;
let nullableNumber: number | null = null;

// 여러개 중에 하나로 타입이 미리 지정되어 있어서 사용 시 자동으로 뜬다
let color: "red" | "orange" | "yellow" = "red";
color = "yellow";
// color = 'green';
// Type '"green"' is not assignable to type '"red" | "orange" | "yellow"'.

function sum(x: number, y: number): number {
  return x + y;
  // return 'asd';
  // Type 'string' is not assignable to type 'number'.
}

const result = sum(1, 2);

function sumArray(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

const total = sumArray([1, 2, 3, 4, 5]);
console.log(total);

function returnNothing(): string | void {
  console.log("어쩌고 저쩌고");
  // return true;
  // Type 'boolean' is not assignable to type 'void'.
  return "asd";
}

returnNothing();

// 2. 타입스크립트 연습 B - Interface, Type Alias (중요!)

// Interface: 클래스 또는 객체를 위한 타입을 지정할 때 사용하는 문법
interface Shape {
  getArea(): number;
}

// implements Shape: interface Shape에 있는 조건에 부합한다
class Circle implements Shape {
  constructor(public radius: number) {}

  getArea() {
    return this.radius * this.radius * Math.PI;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  getArea() {
    return this.width * this.height;
  }
}

const circle: Circle = new Circle(5);
const rectangle: Rectangle = new Rectangle(2, 5);

// public으로 해놓으면 바깥에서도 조회가 가능하고
// private으로 했을 땐 바깥에서 조회 불가능
circle.radius;
rectangle.getArea();

// Circle 타입의 파라미터를 받아온다면 아래와 같이
function getCircleArea(circle: Circle) {
  return circle.getArea();
}

const shapes: Shape[] = [circle, rectangle];

shapes.forEach((shape) => {
  console.log(shape.getArea());
});

// '?'은 있을 수도 있고 없을 수도 있다는 것을 의미
interface Person {
  name: string;
  age?: number;
}

const person: Person = {
  name: "김사람",
  age: 20,
  // interface에 없는 걸 넣었을 때
  // skills: ['javascript']
  // Type '{ name: string; age: number; skills: string[]; }' is not assignable to type 'Person'.
};

// 같은 속성이 중첩될 때는 상속받을 수 있음
interface Developer extends Person {
  skills: string[];
}

const expert: Developer = {
  name: "김개발",
  skills: ["typescript"],
};

// type 도 interface 와 동일하게 작동
type One = {
  name: string;
  age?: number;
};

const woman: One = {
  name: "Alex",
  age: 100,
};

type Engineer = One & {
  skills: string[];
};

const dev: Engineer = {
  name: "Alex",
  skills: ["javascript"],
};

// type alias로는 interface로 못하는 걸 할 수 있음
type People = One[];
const people: People = [woman, dev];

type Color = "red" | "orange" | "yellow";

const specificColor: Color = "orange";

// 대부분의 경우엔 type alias를 써도 상관 없음
// 그러나 어떤 라이브러리를 위한 타입을 설정할 땐 interface 사용을 권장,
// 어떤 걸 사용하든 일관성 있게 사용할 것

// 타입스크립트 연습 C - Generics <T>
// Generics 는 타입 스크립트에서 함수, 클래스, interface, type alias를
// 사용하게 될 때 여러 종류의 타입에 대해 호환을 맞추기 위해 사용

// generics를 쓰게 되면 실제 파라미터에 넣는 타입이 유추가 됨
function merge<T1, T2>(a: T1, b: T2) {
  return {
    ...a,
    ...b,
  };
}

const merged = merge({ foo: 1 }, { bar: 2 });
merged.bar;
// generics를 안 쓰면 . 뒤에 아무것도 자동 완성이 되지 않음

// generic를 쓰게 되면
// any와 다르게 타입이 지켜지면서 어떤 타입인지 유추 가능
function wrap<T>(param: T) {
  return {
    param,
  };
}

const wrapped = wrap(10);
wrapped.param // (property) param: number 가 자동 완성
// 만약 param: any 로 했다면 (property) param: any 로 자동 완성

interface Items<T> {
  list: T[];
}

const items: Items<string> = {
  list: ["a", "b", "c"],
};

const numberItems: Items<number> = {
  list: [1, 2, 3],
};

// 내부에 있는 값의 타입이 어떤 것이든 될 수 있는데
// 그렇다고 해서 any를 사용하기는 싫을 때 (타입을 지키고 싶을 때)
// generics를 사용
type Elements<T, V> = {
  list: T[];
  value: V;
}

const element: Elements<boolean, string> = {
  list: [true, false, true],
  value: 'string'
};

class Queue<T> {
  list: T[] = []; // 기본값을 비어있는 배열로 설정
  get length() {
    return this.list.length;
  }

  enqueue(item: T) {
    this.list.push(item);
    // 리스트의 타입은 T의 배열, 아이템의 타입은 T니까 문제 없이 작동
  }

  dequeue() {
    return this.list.shift();
  }
}

const queue = new Queue<number>();
queue.enqueue(0);
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);

while (queue.length > 0) {
  console.log(queue.dequeue());
}