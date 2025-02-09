// Primitives : number, string, boolean, null, undefined, symbols
// More complex types: arrays, objects
// Function types, parameters

// Primitives
let age: number;

age = 12;

let userName: string = "Jiyun";

let isInstructor: boolean = true;

// More complex types
let hobbies: string[] = ["Sports", "Cooking"];

let person: { name: string; age: number } = {
  name: "Jiyun",
  age: 23,
};

// array of objects
let people: {
  name: string;
  age: number;
}[];

// any : any type is allowed
// but this defeats the purpose of TS

// Type inference
// let course = "React";

// course = 123; // throws an error

// Union
// a type definition that allows multiple types
let course: string | number = "React";
course = 1234;

// type alias
// we can avoid repeatition of entire type definitions
type Person = {
  name: string;
  age: number;
};

// Functions & Types
function add(a: number, b: number) {
  return a + b; // inferred return type
}

function minus(a: number, b: number): number {
  return a - b;
}

function printOutput(value: any): void {
  console.log(value); // doesn't return anything
}

// Gernerics
// type safe but flexible
// they work with any type, but once a certain type is used, that type is locked
function insertAtBeginning<T>(array: T[], value: T) {
  // it tells the types of the array and value should be same
  const newArray = [value, ...array];
  return newArray;
}

const demoArray = [1, 2, 3];

const updatedArray = insertAtBeginning(demoArray, -1);
const stringArray = insertAtBeginning(["a", "b", "c"], "d");
