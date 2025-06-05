type Listener = () => void;

export class state {
    public tramsVisible = false
    public bikesVisible = false
    public routeVisible = false

    public current_pos: [number, number] = [51.046, 3.727]
    public dest_pos: [number, number] | null = null
    public select_location = false

    private listeners: (() => void)[] = []

    update(cb: (s: state) => void) {
        cb(this)
        this.listeners.forEach(fn => fn())
    }

    onchange(fn: () => void) {
        this.listeners.push(fn)
    }

    
};

export const init_states = new state();