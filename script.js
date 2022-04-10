document.getElementById("session-details").style.display = "none"; //skrytí divu při načtění stránky

function selectDate(date){ //uložení vybranéo datumu do localStorage

    let curr_date = new Date();
    let selected_date = new Date(date);

    document.getElementById("error").innerHTML = "";
   
    let date_in_a_week = new Date();
    date_in_a_week.setDate(date_in_a_week.getDate() + 7);

    let date_last_week = new Date();
    date_last_week.setDate(date_last_week.getDate() - 7);

    if(selected_date < date_last_week || selected_date > date_in_a_week){
        console.log("Out of data bounds!");
        document.getElementById("error").innerHTML = "Out of data bounds!";
        document.getElementById("time").disabled = true;   
        document.getElementById("session-details").style.display = "none";
        return;
    }else{
        document.getElementById("time").disabled = false;   
        localStorage.setItem("date", date);
    }
}

function selectTime(time){ //vybrání speceifiké session a vypsání userovi
    if(time >= 0){
        displaySession(localStorage.getItem("date"), time);
    }
}

function displaySession(date, time){ //vypisování specifické session userovi
    document.getElementById("session-details").style.display = "block";
    for (let i = 0; i < sessions.length; i++) {
        if(sessions[i].date == date){
            document.getElementById("session-details").innerHTML = `
            <div class="row">
                <div class="col-md-4 center">
                    <h4><b>${sessions[i].sessions[time].movie_name}</b></h4>
                    <p>${sessions[i].sessions[time].start_time} - ${sessions[i].sessions[time].end_time}</p>
                </div>
                <div class="col-md-4 center mid">
                Seats left: <span id="seat-count">${sessions[i].sessions[time].available_seats}</span>
                </div>
                <div class="col-md-4 center">
                <button id="book-btn" onclick="reserveSeat('${date}', '${time}')" ${checkButton(sessions[i].sessions[time].available_seats, date, time)}>book a seat</button>
                </div>
            </div>
            `;
        }
    }
}

function checkButton(count, date, time){ //vypíná/zapína button na rezervaci místa
    let session_date = new Date(date);
    let current_date = new Date();

    switch(time){
        case "0":
        session_date.setHours(10);
        break;  
        case "1":
        session_date.setHours(12);
        break;
        case "2":
        session_date.setHours(14);
        break;
        case "3":
        session_date.setHours(16);
        break;
        case "4":
        session_date.setHours(18);
        break;
        case "5":
        session_date.setHours(20);
        break;      
    }
    
    if(session_date < current_date){
        return "disabled";
    }

    if(count == 0) return "disabled";
    return "";
}

function reserveSeat(date, time){ //rezervuje místo userovi, upraví localStorage a zase vypíše upravená data userovi
    for (let i = 0; i < sessions.length; i++) {
        if(sessions[i].date == date){
            console.log(sessions[i].sessions[time].available_seats);
            if(sessions[i].sessions[time].available_seats > 0){
                sessions[i].sessions[time].available_seats = sessions[i].sessions[time].available_seats - 1;
            }else{
                document.getElementById("book-btn").style.backgroundColor = "grey";
            }
            localStorage.setItem("sessions", JSON.stringify(sessions));
            displaySession(date, time);
        }
    }
}

function dateFormat(time12h){ // vrací 24h formát času z 12h
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}