window.onload = function() {

    // Function to fetch data from the server
    function fetchData() {
        fetch('http://localhost:8765/data')
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);
                
                // Update UI with received data
                if (data.hv_battery_soc !== undefined) {
                    document.getElementById('fuel-percentage').innerText = `${data.hv_battery_soc}%`;
                    document.getElementById('fuel-level').style.width = `${data.hv_battery_soc}%`;
                }
                if (data.battery_soc !== undefined) {
                    document.getElementById('fuel-percentage').innerText = `${data.battery_soc}%`;
                    document.getElementById('fuel-level').style.width = `${data.battery_soc}%`;
                }
                if (data.hv_battery_pack_temp !== undefined) {
                    document.getElementById('battery-temp').innerText = `${data.hv_battery_pack_temp}°C`;
                }
                if (data.edu_reported_temp !== undefined) {
                    document.getElementById('edu-temp').innerText = `${data.edu_reported_temp}°C`;
                }
                if (data.drive_mode_active !== undefined) {
                    document.getElementById('drive-mode-status').innerText = `Drive Mode: ${data.drive_mode_active}`;
                }
                if (data.distance_to_lead_vehicle !== undefined) {
                    document.getElementById('distance').innerText = `Distance: ${data.distance_to_lead_vehicle}m`;
                }
                if (data.traffic_light_state !== undefined) {
                    updateTrafficLightState(data.traffic_light_state);
                }
                if (data.cacc_mileage_accumulation !== undefined) {
                    document.getElementById('cacc-mileage').innerText = `${data.cacc_mileage_accumulation} mi`;
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    // Poll every 2 seconds to fetch data
    setInterval(fetchData, 2000);

    // Function to send command to the backend when buttons are clicked
    function sendCommand(identifier, value) {
        fetch('http://localhost:8765/send_command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier, value })
        })
        .then(response => response.json())
        .then(data => console.log("Command sent:", data))
        .catch(error => console.error("Error sending command:", error));
    }

    // Button event listeners to send commands when buttons are clicked
    const dmsButton = document.getElementById('dms-button');
    dmsButton.addEventListener('click', () => {
        const isActive = !dmsButton.classList.contains('active');
        toggleButtonState(dmsButton, isActive);
        sendCommand("dms_switch", isActive ? 1 : 0);
    });

    const ainButton = document.getElementById('ain-button');
    ainButton.addEventListener('click', () => {
        const isActive = !ainButton.classList.contains('active');
        toggleButtonState(ainButton, isActive);
        sendCommand("ain_switch", isActive ? 1 : 0);
    });

    const dynoButton = document.getElementById('dyno-button');
    dynoButton.addEventListener('click', () => {
        const isActive = !dynoButton.classList.contains('active');
        toggleButtonState(dynoButton, isActive);
        sendCommand("cav_dyno_mode_switch", isActive ? 1 : 0);
    });

    // Function to toggle button state
    function toggleButtonState(button, isActive) {
        if (isActive) {
            button.classList.add('active');
            button.style.backgroundColor = '#007BFF';
            button.textContent = button.id.replace('-button', '') + ' On';
        } else {
            button.classList.remove('active');
            button.style.backgroundColor = '#333';
            button.textContent = button.id.replace('-button', '') + ' Off';
        }
    }

    // Additional UI update functions as needed
    function updateTrafficLightState(state) {
        const lights = document.querySelectorAll('.light');
        lights.forEach((light, index) => {
            light.classList.toggle('active', index === state);
        });
    }

    // Set default wheel positions
    const frontLeft = document.querySelector('.wheel.front-left');
    const frontRight = document.querySelector('.wheel.front-right');
    const rearLeft = document.querySelector('.wheel.rear-left');
    const rearRight = document.querySelector('.wheel.rear-right');

    frontLeft.style.position = 'absolute';
    frontLeft.style.left = '50px';
    frontLeft.style.top = '50px';
    frontRight.style.position = 'absolute';
    frontRight.style.left = '200px';
    frontRight.style.top = '50px';
    rearLeft.style.position = 'absolute';
    rearLeft.style.left = '50px';
    rearLeft.style.top = '300px';
    rearRight.style.position = 'absolute';
    rearRight.style.left = '200px';
    rearRight.style.top = '300px';

    // Simulate drive mode update
    function updateDriveMode() {
        const driveModes = ['Parked', 'Drive', 'Reverse', 'Neutral'];
        document.getElementById('drive-mode-status').innerText = `Drive Mode: ${driveModes[Math.floor(Math.random() * driveModes.length)]}`;
    }
    setInterval(updateDriveMode, 5000);

    // Example fuel level simulation
    let fuelLevel = 100;
    function updateFuelLevel() {
        if (fuelLevel > 0) {
            fuelLevel -= 0.1;
            document.getElementById('fuel-percentage').innerText = `${fuelLevel.toFixed(1)}%`;
            const fuelElement = document.getElementById('fuel-level');
            fuelElement.style.width = `${fuelLevel}%`;
            fuelElement.style.backgroundColor = fuelLevel > 50 ? 'limegreen' : (fuelLevel > 20 ? 'yellow' : 'red');
        } else {
            fuelLevel = 0;
            document.getElementById('fuel-percentage').innerText = '0%';
            document.getElementById('fuel-level').style.backgroundColor = 'red';
        }
    }
    setInterval(updateFuelLevel, 1000);
}
