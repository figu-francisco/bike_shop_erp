import { addDays, isSameDay, format, setHours, setMinutes, set } from "date-fns";
import enGB from 'date-fns/locale/en-GB';
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Holidays from 'date-holidays';
import api from "../api";
import { useUser } from "../context/UserContext";


function CustomDatePicker({ value, onChange, selectedShop }) {
    const [selectedDateTime, setSelectedDateTime] = useState(value);
    const [takenAppointments, setTakenAppointments] = useState([]);
    const [nBtakenAppointmentsPerDay, setNbTakenAppointmentsPerDay] = useState({});
    const [fullyBookedDays, setFullyBookedDays] = useState([]);

    // Variables from selectedShop.appointment_config
    const shopConf = selectedShop.appointment_config;
    const timeIntervals = shopConf.duration_in_minutes;
    const maxAdvanceBookingDays = shopConf.max_advance_booking_days;

    // Start time must be minus 1 min to be included
    const [hours, minutes, seconds] = shopConf.start_time.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, seconds);
    now.setMinutes(now.getMinutes() - 1);
    const newTimeStr = now.toTimeString().split(" ")[0];
    const [startHours, startMinutes] = newTimeStr.split(":").map(Number);

    const [endHours, endMinutes, endSeconds] = shopConf.end_time.split(":").map(Number);
    const { role } = useUser();

    // Number of slots per day
    const slotsPerDay = ((((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes)) / timeIntervals) + 1).toPrecision(1);

    useEffect(() => {

        setSelectedDateTime(value);
        getTakenAppointments();
        //countTakenAppointmentsPerDay();

    }, [value]);


   /*  takenAppointments.forEach((appointment) => {
        console.log("taken appointment : " + appointment);
    }); */
    /* Fetch holidays from date-holidays library, Belgian in this case
    TODO: create global var for country to pass to Holidays constructor */

    const hd = new Holidays('BE', 'fr');
    const currentYear = new Date().getFullYear();
    const belgianHolidays = hd.getHolidays(currentYear).map(holiday => holiday.date);

    const getTakenAppointments = () => {
        console.log("Fetching taken appointments for shopId: ", selectedShop.id);
        api
            .get(`/appointments/taken/${selectedShop.id}/`)
            .then((res) => res.data)
            .then((data) => { 
                console.log("Raw taken appointments data: ", data);
                const localDates = data.map((d) => new Date(d));
                console.log("Converted taken appointments to local dates: ", localDates);
                setTakenAppointments(localDates); })
            .catch((err) => alert(err));
    };

    /* const countTakenAppointmentsPerDay = (takenAppointments) => {
        const count = takenAppointments.reduce((acc, dt) => {
            const key = format(dt, "yyyy-MM-dd");
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        setNbTakenAppointmentsPerDay(count);
        console.log("Taken appointments per day: ", count);
    } */

    const isFullyBooked = (date) => {
        let count = 0;
        takenAppointments.forEach((taken) => {
            const tk = normalierToUTC(new Date(taken));
            const dt = normalierToUTC(date);
            //console.log(tk + " === " + dt);
            const areSameDate = 
                tk.getFullYear() === dt.getFullYear() &&
                tk.getMonth() === dt.getMonth() &&  
                tk.getDate() === dt.getDate();


            if (areSameDate) {
                count++;
                //console.log("count for day " + dt + " : " + count);
            }
        });
       /*  console.log("date : " + date);
        console.log("count : " + count);
        console.log("slotsPerDay : " + slotsPerDay); */
        return count >= slotsPerDay;
    }


    const isHoliday = (date) => {
        //console.log("Checking holiday for date: ", date);
        return belgianHolidays.some((holiday) => isSameDay(date, new Date(holiday)));
    }

    const isTaken = (dateTime) => {
        return takenAppointments.some((taken) => {
            const tk = taken.getTime();
            const dt = dateTime.getTime();

            if (dt === tk) {
                //console.log("taken slot : " + tk + taken);
                //console.log("dateTime : " + dt + dateTime);
            }
            return dt === tk;
        });
    }

    const isEnabled = (date) => {
        const day = date.getDay();
        const enabledDays = shopConf.weekdays;

        return enabledDays.includes(day.toString());
    }

    const maxTimeIsSmallerThanNow = (date) => {
        if (isSameDay(date, now)) {
            const currentDate = new Date();
            const dateEndTime = new Date();
            dateEndTime.setHours(hours, minutes, seconds);
            return dateEndTime.getTime() > currentDate.getTime();
        } else {
            return true;
        }
    }

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };

    const filterTime = (dateTime) => {
        const notTaken = !isTaken(dateTime);
        const notPast = filterPassedTime(dateTime);
        return notTaken && notPast;
    };

    const normalierToUTC = (dateTime) => new Date(
        Date.UTC(
            dateTime.getFullYear(),
            dateTime.getMonth(),
            dateTime.getDate(),
            dateTime.getHours(),
            dateTime.getMinutes()
        )
    );



    return (
        <div>
            <DatePicker
                showIcon
                toggleCalendarOnIconClick
                selected={selectedDateTime}
                onChange={(date) => {
                    setSelectedDateTime(date);
                    onChange(date);
                }}
                showTimeSelect
                timeFormat="HH:mm"
                filterDate={(date) => !isHoliday(date) && !isTaken(date) && isEnabled(date) && maxTimeIsSmallerThanNow(date) && !isFullyBooked(date)}
                filterTime={filterTime}
                minDate={now}
                maxDate={addDays(new Date(), maxAdvanceBookingDays)}
                minTime={setHours(setMinutes(new Date(), startMinutes), startHours)}
                maxTime={setHours(setMinutes(new Date(), endMinutes), endHours)}
                timeIntervals={timeIntervals}
                dateFormat="MMMM d, yyyy h:mm aa"
                locale={enGB}
                className="border border-gray-300 rounded-lg p-2 bg-primary/75 text-white"
                placeholderText="  Select a date and time"
                //custom-datepicker lives in styles/index.css
                //it override some default styles of react-datepicker
                //so only active dates are shown
                calendarClassName="custom-datepicker"
            />
        </div>
    )
}

export default CustomDatePicker