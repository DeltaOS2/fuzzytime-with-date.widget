/*
  Name:         fuzzytime-with-date.widget
  Description:  Fuzzy Time with date in German and English for Übersicht
  Created:      16.Jan.2019
  Author:       Gert Massheimer
  Version:      2.0
  Note:         This version is updated to REACT while version 1.0 was written in CoffeeScript

 Based on:
   Fuzzy Time widget for Übersicht
   Geoff Oliver
   github.com/plan8studios/fuzzytime
 And:
   Just The Date widget for Übersicht
   Ruurd Pels
   github.com/ruurd/justthedate
-----------------------------------------------------------------------*/


/* Set the language to "de" for German. If it's not set to "de" then
   English is used.
-----------------------------------------------------------------------*/
const LANG = 'de';


/*=== DO NOT EDIT AFTER THIS LINE unless you know what you're doing! ===
========================================================================*/
import { css } from "uebersicht";
export const refreshFrequency = 3000; // every 3000ms = every 3s
export const command = (dispatch) => display();

export const render = (output) => {
  const curTime = display()[0];
  const curDay  = display()[1];
  return (
    <div className={wrapper}>
      <span className={theTime}>{curTime}</span><br/>
      <span className={theDate}>{curDay}</span>
    </div>
  );
};


/**
 * Create the fuzzy time and date string.
 *
 * @returns {{day_str: string, time_str: string}}
 */
function display() {

  let d, date, day_str, fuzzies, hour, hour_str, hours, i, j, minute, month, months, nextHour, next_hour_str, time_str, times, wDay, weekDays, y;

  if (LANG === 'de') {
    hours    = [null, "Eins", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn", "Elf", "Zwölf"];
    times    = ["%h Uhr", "fünf nach %h", "zehn nach %h", "viertel nach %h", "zwanzig nach %h", "fünf vor halb %H", "halb %H", "fünf nach halb %H", "zwanzig vor %H", "viertel vor %H", "zehn vor %H", "fünf vor %H"];
    weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    months   = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  }
  else {
    hours    = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
    times    = ["%h o'clock", "five past %h", "ten past %h", "quarter past %h", "twenty past %h", "twenty five past %h", "half past %h", "twenty five to %H", "twenty to %H", "quarter to %H", "ten to %H", "five to %H"];
    weekDays = ['So', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    months   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  // === Create the Fuzzy Time ===
  fuzzies = [ {minute: 55, index: 11}, {minute: 50, index: 10}, {minute: 45, index: 9}, {minute: 40, index: 8}, {minute: 35, index: 7}, {minute: 30, index: 6}, {minute: 25, index: 5}, {minute: 20, index: 4}, {minute: 15, index: 3}, {minute: 10, index: 2}, {minute: 5, index: 1}, {minute: 0, index: 0}];

  date = new Date();
  minute = date.getMinutes();
  hour = date.getHours();
  hour = hour % 12;

  if (hour === 0) hour = 12;
  nextHour = hour + 1;
  if (nextHour > 12) nextHour = 1;

  hour_str = hours[hour];
  next_hour_str = hours[nextHour];
  time_str = hour_str;

  for (j = 0; j < fuzzies.length; j++) {
    i = fuzzies[j];
    if (i.minute <= minute) {
      if (LANG === 'de' && hour === 1 && minute <= 4 && times[i.index] === '%h Uhr') {
        time_str = 'Ein Uhr';
        break;
      }
      else {
        time_str = times[i.index].replace(/%h/g, hour_str).replace(/%H/g, next_hour_str);
        break;
      }
    }
  }

  // === Create the Date ===
  d = date.getDate();
  y = date.getFullYear();
  wDay = weekDays[date.getDay()];
  month = months[date.getMonth()];
  day_str = '- ' + wDay + ', ' + ("0" + d).slice(-2) + '.' + month + '.' + y + ' -';

  return [time_str, day_str];
}

/* CSS styling
-----------------------------------------------------------------------*/
export const wrapper = css`
  top: 2%;
  left: 2%;
  position: fixed;
  margin-top: -.5rem;
  max-width: 20rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  letter-spacing: .075rem;
  line-height: 1.5;
`;

export const theTime = css`
  color: #a9a9a9;
  font-size: 2rem;
  font-weight: 300;
`;

export const theDate = css`
  color: #a9a9a9;
  font-size: 1.5rem;
  font-weight: 300;
`;

