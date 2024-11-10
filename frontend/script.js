window.onload = function() {

    let previousBatterySoc = document.getElementById('fuel-percentage').innerText;
    let previousBatteryTemp = document.getElementById('battery-temp').innerText;
    let previousCaccMileage = document.getElementById('cacc-mileage').innerText;
    let previousDriveMode = document.getElementById('drive-mode-status').innerText;
    let previousDistance = document.getElementById('distance').innerText;
    let previousFrontMotorTemp = document.getElementById('front-motor-temp').innerText;
    let previousRearMotorTemp = document.getElementById('rear-motor-temp').innerText;

    function fetchData() {
        fetch('http://localhost:8765/data')
            .then(response => response.json())
            .then(data => {
                if (data.battery_soc !== undefined) {
                    previousBatterySoc = `${data.battery_soc}%`;
                }
                document.getElementById('fuel-percentage').innerText = previousBatterySoc;
                document.getElementById('fuel-level').style.width = previousBatterySoc;

                if (data.hv_battery_pack_temp !== undefined) {
                    previousBatteryTemp = `${data.hv_battery_pack_temp}°C`;
                }
                document.getElementById('battery-temp').innerText = previousBatteryTemp;

                if (data.cacc_mileage_accumulation !== undefined) {
                    previousCaccMileage = `${data.cacc_mileage_accumulation} mi`;
                }
                document.getElementById('cacc-mileage').innerText = previousCaccMileage;

                if (data.drive_mode_active !== undefined) {
                    previousDriveMode = `Drive Mode: ${data.drive_mode_active}`;
                }
                document.getElementById('drive-mode-status').innerText = previousDriveMode;

                if (data.distance_to_lead_vehicle !== undefined) {
                    previousDistance = `Distance: ${data.distance_to_lead_vehicle}m`;
                }
                document.getElementById('distance').innerText = previousDistance;

                // Front and Rear Motor Temperatures (EDU Temps)
                if (data.front_edu_reported_temp !== undefined) {
                    previousFrontMotorTemp = `Front Motor Temp: ${data.front_edu_reported_temp}°C`;
                }
                document.getElementById('front-motor-temp').innerText = previousFrontMotorTemp;

                if (data.back_edu_reported_temp !== undefined) {
                    previousRearMotorTemp = `Rear Motor Temp: ${data.back_edu_reported_temp}°C`;
                }
                document.getElementById('rear-motor-temp').innerText = previousRearMotorTemp;

                // Traffic Light State Update
                if (data.traffic_light_state !== undefined) {
                    console.log("Traffic Light State:", data.traffic_light_state);
                    updateTrafficLightState(data.traffic_light_state);
                }

                if (data.drive_mode_active !== undefined) {
                    let driveModeText = "Drive Mode: ";
                    if (data.drive_mode_active === 0) {
                        driveModeText += "Default Drive";
                    } else if (data.drive_mode_active === 1) {
                        driveModeText += "Performance Drive";
                    } else if (data.drive_mode_active === 2) {
                        driveModeText += "ECO Drive";
                    }
                    document.getElementById('drive-mode-status').innerText = driveModeText;
                }

                if (data.front_axle_power !== undefined) {
                    const frontWheels = document.querySelectorAll('.wheel.front-left, .wheel.front-right');
                    frontWheels.forEach(wheel => {
                        wheel.style.backgroundColor = data.front_axle_power === 0 ? 'red' : 'green';
                    });
                }
    
                if (data.rear_axle_power !== undefined) {
                    const rearWheels = document.querySelectorAll('.wheel.rear-left, .wheel.rear-right');
                    rearWheels.forEach(wheel => {
                        wheel.style.backgroundColor = data.rear_axle_power === 0 ? 'red' : 'green';
                    });
                }
                
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function updateTrafficLightState(state) {
        console.log("Updating traffic light with state:", state);
        
        const redLight = document.querySelector('.red-light');
        const yellowLight = document.querySelector('.yellow-light');
        const greenLight = document.querySelector('.green-light');

        // Clear active class from all lights
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
        greenLight.classList.remove('active');

        // Add active class based on traffic light state
        if (state === 0) {
            redLight.classList.add('active');
        } else if (state === 1) {
            yellowLight.classList.add('active');
        } else if (state === 2) {
            greenLight.classList.add('active');
        }
    }

    setInterval(fetchData, 1000);


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

    // // Additional UI update functions as needed
    // function updateTrafficLightState(state) {
    //     const lights = document.querySelectorAll('.light');
    //     lights.forEach((light, index) => {
    //         light.classList.toggle('active', index === state);
    //     });
    // }

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
}
