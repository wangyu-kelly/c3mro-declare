const assert = chai.assert;
const declare = C3MRODeclare

console.log(declare);

const Pig = declare('Pig', [], {
    name: 'pig',
    constructor: function (name) {
        this.name = name;
    },
    talk() {
        const line = `I am a ${this.name}`;
        return line;
    }
});
const ColoredPig = declare('ColoredPig', Pig, {
    color: 'red',
    constructor: function(name, color) {
        Pig.prototype.constructor.call(this, name);
        if (color) {
            this.color = color;
        }
    },
    showColor() {
        const line = `My color is ${this.color}`;
        return line;
    }
});
const pig = new Pig('normal pig');
assert.equal(pig.talk(), 'I am a normal pig');

const redPig = new ColoredPig('red pig');
assert.equal(redPig.talk(), 'I am a red pig');
assert.equal(redPig.color, 'red');
assert.equal(redPig.showColor(), 'My color is red');

const yellowPig = new ColoredPig('yellow pig', 'yellow');
assert.equal(yellowPig.talk(), 'I am a yellow pig');
assert.equal(yellowPig.color, 'yellow');
assert.equal(yellowPig.showColor(), 'My color is yellow');

const Dog = declare({
    name: 'dog',
    sound: 'woof',
    bark() {
        const sound = this.sound;
        const barking = `${[sound, sound, sound].join(', ')}!`;
        return barking;
    }
});
const Husky = declare(Dog, {
    name: 'husky',
    sound: 'arf'
});

let puppy = new Dog();
assert.equal(puppy.name, 'dog');
assert.equal(puppy.bark(), 'woof, woof, woof!');

puppy = new Husky();
assert.equal(puppy.name, 'husky');
assert.equal(puppy.bark(), 'arf, arf, arf!');

const Human = declare('Human');
Human.prototype.walk = () => true;
Human.prototype.say = () => 'Wo-wo-wo!!!';

const Man = declare('Man', [Human]);
Man.prototype.isMan = true;
Man.prototype.say = () => 'I am a man!!!';

const Sportsman = declare('Sportsman', [Human]);
Sportsman.prototype.run = () => true;

const Programmer = declare('Programmer', [Human]);
Programmer.prototype.typing = () => true;
Programmer.prototype.isMan = false; // !!!NOTICE!!!: 继承链数组中越靠前越优先

const Max = declare('Maksim', [Man, Sportsman, Programmer]);
const max = new Max();

assert.equal(max.isMan, true);
assert.equal(max.say(), 'I am a man!!!');
assert.equal(!!max.run, true);
assert.equal(!!max.typing, true);
