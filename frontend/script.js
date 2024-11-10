// Select wheel elements
const frontLeft = document.querySelector('.wheel.front-left');
const frontRight = document.querySelector('.wheel.front-right');
const rearLeft = document.querySelector('.wheel.rear-left');
const rearRight = document.querySelector('.wheel.rear-right');

// Create an array of wheel elements
const wheels = [frontLeft, frontRight, rearLeft, rearRight];

// Initialize WebSocket connection to receive data
const socket = new WebSocket('ws://localhost:8765');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    // Update UI based on received data
    if (data.battery_soc !== undefined) {
        document.getElementById('fuel-percentage').innerText = `${data.battery_soc}%`;
        document.getElementById('fuel-level').style.width = `${data.battery_soc}%`;
    }

    if (data.temperature !== undefined) {
        document.getElementById('battery-temp').innerText = `${data.temperature}°C`;
    }

    // Add any other data updates as needed
};

// Function to update tire pressure and change wheel color
function updateTirePressure() {
    const frontWheels = [frontLeft, frontRight];
    const rearWheels = [rearLeft, rearRight];

    frontWheels.forEach((wheel) => {
        wheel.style.backgroundColor = 'green'; // Set to default color or based on data
    });

    rearWheels.forEach((wheel) => {
        wheel.style.backgroundColor = 'green'; // Set to default color or based on data
    });
}

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

// Update tire pressure every 3 seconds
setInterval(updateTirePressure, 3000);

let caccMileage = 27.3;
function updateMileage() {
    caccMileage += 0.1;
    document.getElementById('cacc-mileage').innerText = caccMileage.toFixed(1) + ' mi';
}
setInterval(updateMileage, 5000);

// Traffic light change every 10 seconds
const lights = document.querySelectorAll('.light');
let currentLight = 2;

function updateTrafficLight() {
    lights.forEach((light, index) => {
        light.classList.toggle('active', index === currentLight);
    });
    currentLight = (currentLight + 1) % lights.length;
}
setInterval(updateTrafficLight, 10000);

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

const dmsButton = document.getElementById('dms-button');
dmsButton.addEventListener('click', () => {
    if (dmsButton.classList.contains('active')) {
        dmsButton.classList.remove('active');
        dmsButton.textContent = 'DMS Off';
        dmsButton.style.backgroundColor = '#333';
    } else {
        dmsButton.classList.add('active');
        dmsButton.textContent = 'DMS On';
        dmsButton.style.backgroundColor = '#007BFF';
    }
});

const ainButton = document.getElementById('ain-button');
ainButton.addEventListener('click', () => {
    if (ainButton.classList.contains('active')) {
        ainButton.classList.remove('active');
        ainButton.textContent = 'AIN Off';
        ainButton.style.backgroundColor = '#333';
    } else {
        ainButton.classList.add('active');
        ainButton.textContent = 'AIN Active';
        ainButton.style.backgroundColor = '#007BFF';
    }
});

const dynoButton = document.getElementById('dyno-button');
dynoButton.addEventListener('click', () => {
    if (dynoButton.classList.contains('active')) {
        dynoButton.classList.remove('active');
        dynoButton.textContent = 'DYNO Off';
        dynoButton.style.backgroundColor = '#333';
    } else {
        dynoButton.classList.add('active');
        dynoButton.textContent = 'DYNO On';
        dynoButton.style.backgroundColor = '#007BFF';
    }
});

function updateMotorTemperatures() {
    const frontMotorTemp = 70; // Replace with WebSocket data if available
    const rearMotorTemp = 70;  // Replace with WebSocket data if available

    document.getElementById('front-motor-temp').innerText = `Front Motor Temp: ${frontMotorTemp}°C`;
    document.getElementById('rear-motor-temp').innerText = `Rear Motor Temp: ${rearMotorTemp}°C`;
}
setInterval(updateMotorTemperatures, 3000);

function updateDriveMode() {
    const driveModes = ['Parked', 'Drive', 'Reverse', 'Neutral'];
    const currentMode = 'Parked'; // Replace with WebSocket data if available

    document.getElementById('drive-mode-status').innerText = `Drive Mode: ${currentMode}`;
    document.getElementById('drive-mode-status').style.color = '#ffffff';
}
setInterval(updateDriveMode, 5000);

let fuelLevel = 100;

function updateFuelLevel() {
    if (fuelLevel > 0) {
        fuelLevel -= 0.1;
        document.getElementById('fuel-percentage').innerText = `${fuelLevel.toFixed(1)}%`;
        const fuelElement = document.getElementById('fuel-level');
        fuelElement.style.width = `${fuelLevel}%`;

        if (fuelLevel > 50) {
            fuelElement.style.backgroundColor = 'limegreen';
        } else if (fuelLevel > 20) {
            fuelElement.style.backgroundColor = 'yellow';
        } else {
            fuelElement.style.backgroundColor = 'red';
        }
    } else {
        fuelLevel = 0;
        document.getElementById('fuel-percentage').innerText = '0%';
        document.getElementById('fuel-level').style.backgroundColor = 'red';
    }
}
setInterval(updateFuelLevel, 1000);
