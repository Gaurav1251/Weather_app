
const Location_API = "https://nominatim.openstreetmap.org/search?format=json&q=";
// const Weather_API = "https://api.open-meteo.com/v1/forecast?latitude=1.28&longitude=103.86&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
const search = document.getElementById("find")
const form = document.getElementById("form")
const loc = document.getElementById("Location");
const temp = document.getElementById("temp");
const type = document.getElementById("type")
const humid = document.getElementById("humid")
const wind = document.getElementById("wind")
const icon = document.getElementById("icon")

const body = document.querySelector("body")
let cityy=""
async function location_to_cord(location) {

    try {
        // loc.textContent=location;
        // console.log("location");

        const res = await fetch(Location_API + location);
        const data = await res.json()
        // console.log(data);
        const lat = data[0].lat
        const long = data[0].lon;
        // console.log(lat,long);
        weather(lat, long)
    } catch (error) {
        // console.log(error);
        alert("Enter Proper City name")

    }




}


function mapWeatherCode(code) {
    const map = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        80: "Rain showers",
        95: "Thunderstorm"
    };
    return map[code] || "Unknown";
}
function mapWeatherCode_img(code) {
    const map = {

        95: "strom_icon.png",


        61: "rain_icon.png",
        63: "rain_icon.png",
        65: "rain_icon.png",
        80: "rain_icon.png",


        2: "cloudy_icon.png",
        3: "cloudy_icon.png",
        45: "cloudy_icon.png",
        48: "cloudy_icon.png",


        0: "clear_sky_icon.png",
        1: "clear_sky_icon.png"
    };

    return map[code] || "clear_sky_icon.png";
}
function back_img(code) {
    const map = {

        95: "strom.jpg",


        61: "rain.jpeg",
        63: "rain.jpeg",
        65: "rain.jpeg",
        80: "rain.jpeg",


        2: "cloudy.jpg",
        3: "cloudy.jpg",
        45: "cloudy.jpg",
        48: "cloudy.jpg",


        0: "clean.jpg",
        1: "clean.jpg"
    };

    return map[code] || "back.webp";
}


function getlocation() {
    window.navigator.geolocation.getCurrentPosition(showPosition, showError,{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
}



function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // console.log(longitude, latitude);
    // alert("Weather Shown for Your Current Location")

    weather(latitude, longitude);
}
function showError(error) {
    let pos = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            pos = "Pune"
            loc.textContent = pos;
            location_to_cord(pos)
            alert("User denied the request for Geolocation. Default Location Pune will be set.");


            break;
        case error.POSITION_UNAVAILABLE:
            pos = "Pune"
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            pos = "Pune"
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            pos = "Pune"
            alert("An unknown error occurred.");
            break;
    }
}

async function weather(Lat, long) {

    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${Lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weathercode,wind_speed_10m_mean,relative_humidity_2m_max&timezone=auto`)

        const data = await res.json()

        const city = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${Lat}&lon=${long}&format=json`)
        const city_data = await city.json()
        console.log(city_data); 
        //loc.textContent = city_data.address.city || city_data.display_name;
        loc.textContent = (city_data.address.city && city_data.address.city.includes(cityy))
            ? city_data.address.city
            : city_data.display_name;
        change_content(data);
    } catch (error) {
        console.log(error);

    }
    // console.log(data);

}


function change_content(data) {

    temp.textContent = `${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_max
        } - ${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max
        }`;

    type.textContent = mapWeatherCode(data.daily.weathercode[0])
    humid.textContent = data.daily.relative_humidity_2m_max[0] + "%"

    wind.textContent = `Avg. ${data.daily.wind_speed_10m_mean[0]} km/hr`
   body.style.background = `url(${back_img(data.daily.weathercode[0])}) no-repeat center center/cover`;

    // console.log(body);
    

    // weather_ico(type.textContent)
    icon.src=mapWeatherCode_img(data.daily.weathercode[0]);

    console.log(data);

    const temp_all_min = data.daily.temperature_2m_min.slice(1);
    const temp_all_max = data.daily.temperature_2m_max.slice(1);
    const type_all = data.daily.weathercode.slice(1);
    const dates = data.daily.time.slice(1)
    // console.log(dates);

    // console.log(type_all);

    // console.log(temp_all_min);
    // console.log(temp_all_max);


    const forecast = document.getElementById("next")

    forecast.innerHTML = '';
    dates.forEach((date, index) => {
        const min = temp_all_min[index];
        const max = temp_all_max[index];
        const code = type_all[index];
        const iconSrc = mapWeatherCode_img(code);

        
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short'
        });

        
        const card = `
        <div class="col text-center text-light p-2" style="min-width: 100px;">
            <p style="font-weight:bold;">${formattedDate}</p>
            <img src="${iconSrc}" alt="${iconSrc}" style="height: 40px;">
            <p>${min}°C -${max}°C</p>
        </div>
    `;

        forecast.innerHTML += card;
    });

    // console.log(type.textContent);
    // console.log(data);

}



// function weather_ico(a) {
//     switch (a) {
//         case "Thunderstorm":
//             icon.src = "strom_icon.png";
//             icon.alt = "storm_icon";
//             break;

//         case "Slight rain":
//         case "Moderate rain":
//         case "Heavy rain":
//         case "Rain showers":
//             icon.src = "rain_icon.png";
//             icon.alt = "rain_icon";
//             break;

//         case "Partly cloudy":
//         case "Overcast":
//         case "Fog":
//             icon.src = "cloudy_icon.png";
//             icon.alt = "cloudy_icon";
//             break;

//         case "Clear sky":
//         case "Mainly clear":
//             icon.src = "clear_sky_icon.png";
//             icon.alt = "clear_sky_icon";
//             break;

//         default:
//             icon.alt = "";
//             break;
//     }

// }


search.addEventListener("click", (e) => {

    e.preventDefault();
    const city = form.City.value;
    // console.log(city);


    if (city !== '') {
        cityy=city
        location_to_cord(city);
        // loc.textContent = city;

    }
    else {
        alert("Enter a city")
    }


});

getlocation()

