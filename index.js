const { dialog } = require('electron');
const { Extension, log, INPUT_METHOD, PLATFORMS } = require('deckboard-kit');
const { windowManager } = require("node-window-manager");
console.log(windowManager.requestAccessibility()); // required on macOS
const monitors = windowManager.getMonitors();
const windows = windowManager.getWindows();

class WindowSnap extends Extension {
    constructor() {
        super();
        //get the monitors
        let monitor_count = 0;
        let monitor_input_items = monitors.map(monitor => {
            let monitor_label
            if (monitor.isPrimary()) {
                monitor_label = 'Primary'
            } else {
                monitor_label = monitor_count
            }
            monitor_count ++
            return {
                label: monitor_label,
                value: monitor.id
            }
        })
        //get the windows
        let window_input_items = windows.filter(window => {
            return (window.isVisible() !== false && window.getTitle() !== "")
        }).map(window => {
            return {
                label: window.getTitle(),
                value: window.id
            }
        });
        this.name = 'Window Snap';
        this.platforms = [PLATFORMS.WINDOWS];
        this.inputs = [
            {
                label: 'Snap Window',
                value: 'snap-window',
                icon: 'arrows-alt',
                color: '#34495e',
                input: [
                    {
                        label: 'Snap to Monitor',
                        ref: 'monitor',
                        type: INPUT_METHOD.INPUT_SELECT,
                        items: monitor_input_items
                    },
                    {
                        label: 'Window to Snap',
                        ref: 'window',
                        type: INPUT_METHOD.INPUT_SELECT,
                        items: window_input_items
                    },
                ]
            }
        ];
    }
    execute(action, { monitor, window }) {
        let new_x_pos = 0;
        monitors.forEach(possible_monitor => {
            if (possible_monitor.id === monitor ) {
                new_x_pos = possible_monitor.getBounds().x
            }
        })
        console.log(new_x_pos)
        windows.forEach(possible_window => {
            if (possible_window.id == window ) {
                possible_window.setBounds({x: new_x_pos})
                possible_window.maximize();
            }
        })
    }
}
module.exports = new WindowSnap();