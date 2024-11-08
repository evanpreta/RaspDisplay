// Select wheel elements
const frontLeft = document.querySelector('.wheel.front-left');
const frontRight = document.querySelector('.wheel.front-right');
const rearLeft = document.querySelector('.wheel.rear-left');
const rearRight = document.querySelector('.wheel.rear-right');

// Create an array of wheel elements
const wheels = [frontLeft, frontRight, rearLeft, rearRight];

// Function to update tire pressure and change wheel color
function updateTirePressure() {
    // Generate random pressures for the front and rear axles
    const frontAxlePressure = Math.random(); // Random value between 0 and 1
    const rearAxlePressure = Math.random();  // Random value between 0 and 1

    // Set front wheels' pressure based on front axle
    const frontWheels = [frontLeft, frontRight];
    frontWheels.forEach((wheel) => {
        if (frontAxlePressure > 0.5) {
            wheel.style.backgroundColor = 'green'; // Optimal pressure
        } else if (frontAxlePressure > 0.2) {
            wheel.style.backgroundColor = 'yellow'; // Low pressure
        } else {
            wheel.style.backgroundColor = 'red'; // Critical pressure
        }
    });

    // Set rear wheels' pressure based on rear axle
    const rearWheels = [rearLeft, rearRight];
    rearWheels.forEach((wheel) => {
        if (rearAxlePressure > 0.5) {
            wheel.style.backgroundColor = 'green'; // Optimal pressure
        } else if (rearAxlePressure > 0.2) {
            wheel.style.backgroundColor = 'yellow'; // Low pressure
        } else {
            wheel.style.backgroundColor = 'red'; // Critical pressure
        }
    });
}

frontLeft.style.position = 'absolute';
frontLeft.style.left = '50px';  // Set the X position
frontLeft.style.top = '50px';   // Set the Y position

frontRight.style.position = 'absolute';
frontRight.style.left = '200px';  // Set the X position
frontRight.style.top = '50px';   // Set the Y position

rearLeft.style.position = 'absolute';
rearLeft.style.left = '50px';  // Set the X position
rearLeft.style.top = '300px';   // Set the Y position

rearRight.style.position = 'absolute';
rearRight.style.left = '200px';  // Set the X position
rearRight.style.top = '300px'; 
// Update tire pressure every 3 seconds
setInterval(updateTirePressure, 3000);


// Set positions of the wheels (as in your original code)
// Adjusted position of all wheels to fit onto PI aspect ratio
// Front wheels by -50 y and Rear by -100 y



// Simulate CACC mileage increasing every 5 seconds
let caccMileage = 27.3;

function updateMileage() {
    caccMileage += 0.1;
    document.getElementById('cacc-mileage').innerText = caccMileage.toFixed(1) + ' mi';
}
setInterval(updateMileage, 5000);

// Simulate traffic light change every 10 seconds
const lights = document.querySelectorAll('.light');
let currentLight = 2; // Start with green light

function updateTrafficLight() {
    lights.forEach((light, index) => {
        light.classList.toggle('active', index === currentLight);
    });
    currentLight = (currentLight + 1) % lights.length;
}
setInterval(updateTrafficLight, 10000);

// Update distance and time to traffic light every second
let distance = 50;
let time = 5;

function updateDistanceAndTime() {
    if (distance > 0) {
        distance -= 1;
        time -= 0.1;
    }
    document.getElementById('distance').innerText = `Distance: ${distance}m`;
    document.getElementById('time').innerText = `Time: ${time.toFixed(1)}s`;
}
setInterval(updateDistanceAndTime, 1000);

let batteryTemp = 76; // Default battery temperature

// Update Battery Temperature (Dashboard & Battery Line)
function updateBatteryTemp() {
    batteryTemp = Math.floor(Math.random() * 15) + 70; // Random temp between 70-85°C

    // Update the dashboard battery temperature
    document.getElementById('battery-temp').innerText = `${batteryTemp}°C`;

    // Update the battery line width based on the temperature value (relative to 85°C)
    const batteryLineWidth = ((batteryTemp - 70) / 15) * 100;
    document.querySelector('.battery-line').style.width = `${batteryLineWidth}%`;
}

// Update every 3 seconds
setInterval(updateBatteryTemp, 3000);

// Simulate CACC mileage increasing every 5 seconds
function updateMileage() {
    caccMileage += 0.1;
    document.getElementById('cacc-mileage').innerText = `${caccMileage.toFixed(1)} mi`;
}
setInterval(updateMileage, 5000);

const dmsButton = document.getElementById('dms-button');

dmsButton.addEventListener('click', () => {
    if (dmsButton.classList.contains('active')) {
        dmsButton.classList.remove('active');
        dmsButton.textContent = 'DMS Off';
        dmsButton.style.backgroundColor = '#333'; // Original color
    } else {
        dmsButton.classList.add('active');
        dmsButton.textContent = 'DMS On';
        dmsButton.style.backgroundColor = '#007BFF'; // Active color
    }
});

const ainButton = document.getElementById('ain-button');

ainButton.addEventListener('click', () => {
    if (ainButton.classList.contains('active')) {
        ainButton.classList.remove('active');
        ainButton.textContent = 'AIN Off';
        ainButton.style.backgroundColor = '#333'; // Original color
    } else {
        ainButton.classList.add('active');
        ainButton.textContent = 'AIN Active';
        ainButton.style.backgroundColor = '#007BFF'; // Active color
    }
});

const dynoButton = document.getElementById('dyno-button');

dynoButton.addEventListener('click', () => {
    if (dynoButton.classList.contains('active')) {
        dynoButton.classList.remove('active');
        dynoButton.textContent = 'DYNO Off';
        dynoButton.style.backgroundColor = '#333'; // Original color
    } else {
        dynoButton.classList.add('active');
        dynoButton.textContent = 'DYNO On';
        dynoButton.style.backgroundColor = '#007BFF'; // Active color
    }
});

function updateMotorTemperatures() {
    const frontMotorTemp = Math.floor(Math.random() * 30) + 60; // Random temp between 60-90°C
    const rearMotorTemp = Math.floor(Math.random() * 30) + 60;  // Random temp between 60-90°C

    document.getElementById('front-motor-temp').innerText = `Front Motor Temp: ${frontMotorTemp}°C`;
    document.getElementById('rear-motor-temp').innerText = `Rear Motor Temp: ${rearMotorTemp}°C`;
}

// Update temperatures every 3 seconds
setInterval(updateMotorTemperatures, 3000);

function updateDriveMode() {
    const driveModes = ['Parked', 'Drive', 'Reverse', 'Neutral'];
    const currentMode = driveModes[Math.floor(Math.random() * driveModes.length)];

    document.getElementById('drive-mode-status').innerText = `Drive Mode: ${currentMode}`;

    // Optional: Change color based on the mode
    if (currentMode === 'Drive') {
        document.getElementById('drive-mode-status').style.color = '#ffffff'; // Green
    } else if (currentMode === 'Reverse') {
        document.getElementById('drive-mode-status').style.color = '#ffffff'; // Red
    } else {
        document.getElementById('drive-mode-status').style.color = '#ffffff'; // White
    }
}

// Update drive mode every 5 seconds (adjust as needed)
setInterval(updateDriveMode, 5000);

let fuelLevel = 100; // Initial fuel percentage

function updateFuelLevel() {
    if (fuelLevel > 0) {
        fuelLevel -= 0.1; // Decrease fuel level over time
        document.getElementById('fuel-percentage').innerText = `${fuelLevel.toFixed(1)}%`;
        
        const fuelElement = document.getElementById('fuel-level');
        fuelElement.style.width = `${fuelLevel}%`;

        // Change color based on fuel level
        if (fuelLevel > 50) {
            fuelElement.style.backgroundColor = 'limegreen'; // Green for more than 50%
        } else if (fuelLevel > 20) {
            fuelElement.style.backgroundColor = 'yellow'; // Yellow for 20% - 50%
        } else {
            fuelElement.style.backgroundColor = 'red'; // Red for less than 20%
        }
    } else {
        fuelLevel = 0;
        document.getElementById('fuel-percentage').innerText = '0%';
        fuelElement.style.backgroundColor = 'red';
    }
}

// Update fuel level every second (adjust interval as needed)
setInterval(updateFuelLevel, 1000);
