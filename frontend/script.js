const frontLeft = document.querySelector('.wheel.front-left');
const frontRight = document.querySelector('.wheel.front-right');
const rearLeft = document.querySelector('.wheel.rear-left');
const rearRight = document.querySelector('.wheel.rear-right');
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

    // Other data mappings if needed
};

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

function updateTrafficLight() {
    const lights = document.querySelectorAll('.light');
    let currentLight = 2;
    lights.forEach((light, index) => {
        light.classList.toggle('active', index === currentLight);
    });
    currentLight = (currentLight + 1) % lights.length;
}
setInterval(updateTrafficLight, 10000);

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
        fuelElement.style.backgroundColor = 'red';
    }
}
setInterval(updateFuelLevel, 1000);
