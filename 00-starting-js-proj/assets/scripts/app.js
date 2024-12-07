/*
import { apikey, abc } from "./util.js";
import key from "./util.js";

console.log(apikey);
console.log(abc);
console.log(key);


import * as util from "./util.js"; // import as a js object (grouping mutiple exported things)

console.log(util.abc);
console.log(util.default);
*/

import { idText } from "typescript";

// variables, values

// string, number, boolean, null, undefined
// null: explicitly assigned by developer (reset value)
// undefined: default if no value was assigned yet
console.log("Hello World!");

// variable : data containers used for reusability and readability
let userMessage = "Hello World!";
console.log(userMessage);
console.log(userMessage);
console.log(userMessage);

const name = "jiyun";
// const cannot be reassigned
// name = "kelly"; // error

// operators
console.log(10 / 3);
console.log("hello" + "world"); // + is used to concatenate strings
console.log(10 === 5); // check for equality

if (10 === 10) {
  console.log("Works");
}

// functions
function greetUser(userName, message = "Hello!") {
  // define a function
  console.log(userName);
  console.log(message);
}

greetUser("Alex");
greetUser("jiyun", "hello world!"); // execute the function
greetUser("Manuel", "Hello, what's up?");

// function with a return value
function createGreeting(userName, message = "Hello!") {
  return "Hi, I am " + userName + ". " + message;
}
const greeting = createGreeting("Max");
console.log(greeting);

// arrow function : annoymous function which doesn't carry any name
export default (userName, message) => {
  return userName + message;
};

// objects
// group multiple value together (with key and value pairs)
const user = {
  name: "Max",
  age: 34,
  greet() {
    console.log("Hello!");
    console.log(this.age);
  },
};
console.log(user);
console.log(user.name);
user.greet();

class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    console.log("Hi!");
  }
}

const user1 = new User("Manuel", 35);
console.log(user1);
user1.greet();

// arrays
// technically is an object
// group values together
// array can contain arrays, objects, numbers, strings...
const hobbies = ["sports", "cooking", "reading"];
console.log(hobbies[0]);

// built in functions as to array
hobbies.push("working"); // add a new item to an array
console.log(hobbies);

// findIndex needs a function
const index = hobbies.findIndex((item) => {
  return item === "sports"; // if it returns true, findIndex will find the index, otherwise it will do nothing
}); // find an index of certain value
console.log(index);

// map : transform every item in an array
hobbies.map((item) => item + "!");
console.log(hobbies); // won't change the originial array

const editiedHobbies = hobbies.map((item) => item + "!");
console.log(editiedHobbies); // map will return a new array

// map can also create an object
const editiedHobbies2 = hobbies.map((item) => ({ text: item }));
console.log(editiedHobbies2);

// destructuring objects and arrays
const userNameData = ["Jiyun", "Kim"];

const [firstName, lastName] = userNameData; // elements are pulled out by position
console.log(firstName);
console.log(lastName);

const user2 = {
  firstname: "Jiyun",
  age: 24,
};

const { firstname, age } = user2; // pulled out by property name
console.log(firstname);
console.log(age);

// spread operator
const newHobbies = ["reading"];
const mergedHobbies = [...hobbies, ...newHobbies]; // pull out all the elements of array and add them as standalone values to a array
console.log(mergedHobbies);

const extendedUser = {
  isAdmin: true,
  ...user2,
};
console.log(extendedUser);

// control structure
// const password = prompt("Your password: ");
/*
if (password === "Hello") {
  console.log("Hello works");
} else if (password === "hello") {
  console.log("hello works");
} else {
  console.log("Access not granted");
}

for (const hobby of hobbies) {
  console.log(hobby);
}
  */

// use functions as values
function handleTimeout() {
  console.log("Time out!");
}

const handleTimeout2 = () => {
  console.log("Time out... agian!");
};

// define function first, then pass it by name
setTimeout(handleTimeout, 2000);
setTimeout(handleTimeout2, 3000);
// can pass an arrow function instead of defining it first
setTimeout(() => {
  console.log("More timing out....");
}, 4000);

function greeter(greetFn) {
  greetFn();
}

greeter(() => console.log("Hi"));

// define functions inside of fuctions
function init() {
  function greet() {
    console.log("hi!");
  }
  greet();
}
init();

// reference vs primitive values
// primitives cannot be edited
let userMessage2 = "Hello!";
userMessage2 = userMessage2.concat("!!!"); // produce a new value
console.log(userMessage2);

// objects and arrays (also objects)
const hobbies2 = ["sports", "cooking"];
hobbies2.push("working");
console.log(hobbies2); // edit the original array
// references can't store the value, instead the address of that value in memory

// const means the variable can't be overwritten, not can't not be edited

// for objects. the memory address is stored in the variable
// the underlying balue can be edited without changing that address
// the value can therefore be edited without reassigning the value
