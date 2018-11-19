import Event from './Event';

export default class Eventful {
    private _events: Event[] = [];

    /**
     * 
     * @param eventNames 
     * @param action 
     */
    public on(eventNames: String | String[], action: Function, executionsLimit?: Number) {
        let eventNamesArr: String[] = [];
        if (typeof action !== 'function') {
            throw "Bad argument: action has to be of type Function."
        }
        if (typeof eventNames === 'string') {
            eventNamesArr = eventNames.split(' ');
        } else if (Array.isArray(eventNames)) {
            eventNamesArr = eventNames;
        } else {
            throw "Bad argument: eventNames has to be of type String | String[].";
        }
        eventNamesArr.forEach(eventName => {
            let event;
            if (typeof executionsLimit === 'number') {
                event = new Event(eventName, action, executionsLimit)
            } else {
                event = new Event(eventName, action)
            }
            this._events.push(event)
        })
        return this;
    }

    public once(eventNames, action) {
        this.on(eventNames, action, 1);
        return this;
    }

    /**
     * 
     * @param eventName 
     * @param action 
     */
    public off(eventName: String, action: Function) {

    }

    /**
     * 
     * @param eventName 
     */
    protected getTrigger(eventName: String): Function {
        const eventsToTrigger = this._events.filter(event => event.name === eventName);
        return (...args) => {
            eventsToTrigger.forEach(event => {
                event.getActionForExecution().call(this, ...args);

            })
            this._events = this._events.filter(event => event.isPersisting);
        }
    }

    /**
     * 
     * @param eventName 
     * @param args 
     */
    protected trigger(eventName: String, args: any[] = []) {
        this.getTrigger(eventName)(...args);
    }

}
