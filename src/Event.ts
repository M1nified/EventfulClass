export default class Event {
    private _name: String;
    private _action: Function;
    private _executionsCountdown: Number | Boolean = true;
    constructor(name: String, action: Function, executionsLimit?: Number) {
        this._name = name;
        this._action = action;
        if (typeof executionsLimit === 'number') {
            this._executionsCountdown = executionsLimit;
        }
    }

    public get name(): String {
        return this._name;
    }

    public get action(): Function {
        return this._action;
    }

    public get isPersisting(): Boolean {
        return !!this._executionsCountdown;
    }

    public getActionForExecution(): Function {
        if (!!this._executionsCountdown) {
            if (typeof this._executionsCountdown === 'number') this._executionsCountdown--;
            return this.action;
        } else {
            return () => { };
        }
    }

}
