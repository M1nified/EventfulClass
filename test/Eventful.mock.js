const chai = require('chai');
const Eventful = require('..');

chai.should();
var expect = chai.expect;

class Class1 extends Eventful {
    constructor() {
        super();
        this.function1marker = 0;
        this.function2marker1 = 0;
        this.function2marker2 = 0;
    }
    function1() {
        this.getTrigger('function1Complete')()
    }
    function2(x) {
        this.getTrigger('function2Complete')(x)
    }
}

describe('class extending Eventful', function () {
    let class1Instance1 = null;
    let a = 1;
    this.beforeEach(function () {
        class1Instance1 = new Class1();
    })
    it('should be an instance of Eventful', function () {
        class1Instance1.should.be.an.instanceOf(Eventful);
    })
    it('should have on() function', function () {
        class1Instance1.should.have.property('on')
        class1Instance1.on.should.be.a('function')
    })
    it('should have once() function', function () {
        class1Instance1.should.have.property('once')
        class1Instance1.once.should.be.a('function');
    })
    it('should have off() function', function () {
        class1Instance1.should.have.property('off')
        class1Instance1.off.should.be.a('function');
    })
    it('should have getTrigger() function', function () {
        class1Instance1.should.have.property('getTrigger')
        class1Instance1.getTrigger.should.be.a('function');
    })
    describe('on()', function () {
        it('should register new event', function () {
            class1Instance1.on('click', () => a++);
            class1Instance1._events.should.have.lengthOf(1);
        })
        it('should register multiple events using space separated list of events', function () {
            class1Instance1.on('click press', () => a++);
            class1Instance1._events.should.have.lengthOf(2);
        })
        it('should be able to chain', function () {
            class1Instance1
                .on('click', () => a++)
                .on('mouseout', () => a--);
            class1Instance1._events.should.have.lengthOf(2);
        })
        it('should return class instance', function () {
            let ret = class1Instance1.on('click press', () => a++);
            ret.should.be.equal(class1Instance1);
        })
    })
    describe('getTrigger()', function () {
        let valToBeChanged1 = 0,
            valToBeChanged2 = 0,
            valToInc1 = 0;
        const noArgsTrigger = () => valToBeChanged1 = 10;
        const oneArgTrigger1 = x => valToBeChanged1 = x;
        const oneArgTrigger2 = x => valToBeChanged2 = x;
        this.beforeEach(function () {
            valToBeChanged1 = 0;
            valToBeChanged2 = 0
            class1Instance1
                .on('noArgsTrigger', noArgsTrigger)
                .on('oneArgTrigger', oneArgTrigger1)
                .on('oneArgTrigger', oneArgTrigger2)
                .once('singleEvent', () => valToInc1++)
        })
        it('should return action trigger', function () {
            let action = class1Instance1.getTrigger('oneArgTrigger');
            action.should.be.a('function');
        })
        describe('()', function () {
            it('should execute trigger', function () {
                class1Instance1.getTrigger('noArgsTrigger')();
                valToBeChanged1.should.be.equal(10);
            })
            it('should execute multiple triggers', function () {
                class1Instance1.getTrigger('oneArgTrigger')();
                expect(valToBeChanged1).to.be.an('undefined')
                expect(valToBeChanged2).to.be.an('undefined')
            })
        })
        describe('(...args)', function () {
            it('should execute trigger', function () {
                class1Instance1.getTrigger('noArgsTrigger')(1);
                valToBeChanged1.should.be.equal(10);
            })
            it('should execute multiple triggers', function () {
                class1Instance1.getTrigger('oneArgTrigger')(1);
                valToBeChanged1.should.be.equal(1)
                valToBeChanged2.should.be.equal(1)
            })
        })
        describe('called from class function', function () {
            this.beforeEach(function () {
                class1Instance1
                    .on('function1Complete', function () { this.function1marker = 10 })
                    .on('function2Complete', function (x) { this.function2marker1 = x })
                    .on('function2Complete', function (x) { this.function2marker2 = 2 * x })
            })
            it('should execute action with 0 arguments an modify class instance property', function () {
                class1Instance1.function1();
                class1Instance1.function1marker.should.be.equal(10)
            })
            it('should execute action with 1 argument an modify class instance property', function () {
                class1Instance1.function2(5);
                class1Instance1.function2marker1.should.be.equal(5)
                class1Instance1.function2marker2.should.be.equal(10)
            })
        })
        describe('called for once event', function () {
            let eventsLen;
            this.beforeEach(function () {
                eventsLen = class1Instance1._events.length;
                class1Instance1.getTrigger('singleEvent')()
                class1Instance1.getTrigger('singleEvent')()
            })
            it('should execute once', function () {
                valToInc1.should.be.equal(1);
            })
            it('should remove listener', function () {
                class1Instance1._events.should.have.lengthOf(eventsLen - 1)
            })
        })
    })
})
