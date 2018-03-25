#
# Fuzzy Time with date in German and English for Übersicht
# 25.Mar.2018
# Gert Massheimer (deltaos.de)
#
#
# Based on:
# Fuzzy Time widget for Übersicht
# Geoff Oliver
# github.com/plan8studios/fuzzytime
# And:
# Just The Date widget for Übersicht
# Ruurd Pels
# github.com/ruurd/justthedate#
#
#
# Adjust the styles as you like
#
style =
  # Define the maximum width of the widget.
  width: "45%"

  # Define the position, where to display the time.
  # Set properties you don't need to "auto"
  position:
    top:    "2%"
    left:   "2%"
    bottom: "auto"
    right:  "auto"

  # Font properties
  font:            "'Helvetica Neue', sans-serif"
  font_color:      "#a9a9a9"
  font_size:       "2rem"
  font_weight:     "400"
  letter_spacing:  "0.025rem"

  # Misc
  text_align:     "left"
  #text_transform: "capitalize"

# Fallback Shell command:
command: "LC_ALL=de_DE.UTF-8;export LC_ALL;echo $(date '+ %a,%d.%b.%Y')"

# Lower the frequency for more accuracy.
refreshFrequency: (1000 * 3) # (1000 * n) seconds

# If you want the same font for the date display as for the time display
# then remove the style definition for the span elememt
render: (o) -> """
  <div id="content">
    <span id="time"></span><br />
    <span style="font-size:1.5rem" id="date"></span><br />
  </div>
"""


update: (output, dom) ->
  # Set the language to "de" for German. If it's not set to "de" then
  # English is used.
  lang = 'de'

  if lang == 'de'
    hours = [null, "Eins", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben",
             "Acht", "Neun", "Zehn", "Elf", "Zwölf"]
    times = ["%h Uhr", "fünf nach %h", "zehn nach %h", "viertel nach %h",
             "zwanzig nach %h", "fünf vor halb %H", "halb %H", "fünf nach halb %h",
             "zwanzig vor %H", "viertel vor %H", "zehn vor %H", "fünf vor %H"]
    weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  else
    hours = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven",
             "Eight", "Nine", "Ten", "Eleven", "Twelve"]
    times = ["%h o'clock", "five after %h", "ten after %h", "quarter after %h",
             "twenty after %h", "twenty five after %h", "half past %h", "twenty five to %H",
            "twenty to %H", "quarter to %H", "ten to %H", "five to %H"]
    weekDays = ['So', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  # === Create the Fuzzy Time ===
  fuzzies = [
    { minute: 55, index: 11 }
    { minute: 50, index: 10 }
    { minute: 45, index:  9 }
    { minute: 40, index:  8 }
    { minute: 35, index:  7 }
    { minute: 30, index:  6 }
    { minute: 25, index:  5 }
    { minute: 20, index:  4 }
    { minute: 15, index:  3 }
    { minute: 10, index:  2 }
    { minute:  5, index:  1 }
    { minute:  0, index:  0 }
  ]
  date   = new Date()
  minute = date.getMinutes()
  hour   = date.getHours()
  hour   = hour % 12
  hour   = 12 if hour == 0
  nextHour = hour + 1
  if nextHour > 12
    nextHour = 1

  hour_str = hours[hour]
  next_hour_str = hours[nextHour]
  time_str = hour_str
  for i in fuzzies
    if i.minute <= minute
      if lang == 'de' and hour == 1 and minute <= 4 and times[i.index] == '%h Uhr'
        time_str = 'Ein Uhr'
      else
        time_str = times[i.index].replace(/%h/g, hour_str).replace(/%H/g, next_hour_str)
        break

  # === Create the Date ===
  d = date.getDate()
  y = date.getFullYear()
  wDay = weekDays[date.getDay()]
  month = months[date.getMonth()]
  day_str = '- ' + wDay + ', ' + ("0" + d).slice(-2) + '.' + month + '.' + y + ' -'

  # --- replace time-ID in html ---
  $(dom).find("#time").html(time_str)
  # --- replace date-ID in html ---
  $(dom).find("#date").html(day_str)
  return

# === use the CSS styles ===
style: """
  top: #{style.position.top}
  bottom: #{style.position.bottom}
  right: #{style.position.right}
  left: #{style.position.left}
  width: #{style.width}
  font-family: #{style.font}
  color: #{style.font_color}
  font-weight: #{style.font_weight}
  text-align: #{style.text_align}
  text-transform: #{style.text_transform}
  font-size: #{style.font_size}
  letter-spacing: #{style.letter_spacing}
  font-smoothing: antialiased
  line-height: #{style.line_height}
"""
