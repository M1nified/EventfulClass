const chai = require('chai');
const Event = require('../dist/Event').default;

chai.should();

describe('class Event', function () {
    let event1, event2;
    let event1Function = (value) => { valueToBeChanged = value };
    let valueToBeChanged = null,
        valueToInc1 = 0,
        valueToInc2 = 0;
    this.beforeEach(function () {
        event1 = new Event('click', event1Function);
        event2 = new Event('limited1', () => valueToInc1++, 1);
        event3 = new Event('limited2', () => valueToInc2++, 2);
    })
    describe('get name()', function () {
        it('should be a string', function () {
            event1.name.should.be.a('string');
        })
        it('should be click', function () {
            event1.name.should.equal('click');
        })
    })
    describe('get action()', function () {
        it('should be a function', function () {
            event1.action.should.be.a('function');
        })
        it('should keep reference', function () {
            event1.action.should.equal(event1Function);
        })
    })
    describe('getActionForExecution()', function () {
        it('should execute action and pass the argument', function () {
            event1.getActionForExecution()(123);
            valueToBeChanged.should.equal(123);
        })
        it('shoult check executionsCounter', function () {
            event2.getActionForExecution()();
            event2.getActionForExecution()();
            event2.getActionForExecution()();
            valueToInc1.should.be.equal(1);
            event3.getActionForExecution()();
            valueToInc2.should.be.equal(1);
            event3.getActionForExecution()();
            event3.getActionForExecution()();
            event3.getActionForExecution()();
            event3.getActionForExecution()();
            valueToInc2.should.be.equal(2);
        })
    })
})
