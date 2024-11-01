// Select wheel elements
const frontLeft = document.querySelector('.wheel.front-left');
const frontRight = document.querySelector('.wheel.front-right');
const rearLeft = document.querySelector('.wheel.rear-left');
const rearRight = document.querySelector('.wheel.rear-right');

// Create an array of wheel elements
const wheels = [frontLeft, frontRight, rearLeft, rearRight];

// Function to update tire pressure and change wheel color
function updateTirePressure() {
    wheels.forEach((wheel) => {
        const pressure = Math.random(); // Random value between 0 and 1
        if (pressure > 0.5) {
            wheel.style.backgroundColor = 'green'; // Optimal pressure
        } else if (pressure > 0.2) {
            wheel.style.backgroundColor = 'yellow'; // Low pressure
        } else {
            wheel.style.backgroundColor = 'red'; // Critical pressure
        }
    });
}

// Set positions of the wheels (as in your original code)
// Adjusted position of all wheels to fit onto PI aspect ratio
// Front wheels by -50 y and Rear by -100 y
frontLeft.style.position = 'absolute';
frontLeft.style.left = '0px';  // Set the X position
frontLeft.style.top = '50px';   // Set the Y position

frontRight.style.position = 'absolute';
frontRight.style.left = '150px';  // Set the X position
frontRight.style.top = '50px';   // Set the Y position

rearLeft.style.position = 'absolute';
rearLeft.style.left = '0px';  // Set the X position
rearLeft.style.top = '300px';   // Set the Y position

rearRight.style.position = 'absolute';
rearRight.style.left = '150px';  // Set the X position
rearRight.style.top = '300px'; 

// Update tire pressure every 3 seconds
setInterval(updateTirePressure, 3000);

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

// Select all indicator buttons
const indicators = document.querySelectorAll('.indicator');

// Function to toggle color
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        if (indicator.classList.contains('active')) {
            indicator.classList.remove('active');
            indicator.style.backgroundColor = '#333'; // Original color
        } else {
            indicator.classList.add('active');
            indicator.style.backgroundColor = '#007BFF'; // Active color (change as desired)
        }
    });
});
