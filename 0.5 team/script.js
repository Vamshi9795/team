document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        events: [],
        dateClick: function(info) {
            var title = prompt('Enter Event Title:');
            if (title) {
                var startTime = prompt('Enter start time (HH:MM AM/PM):');
                var endTime = prompt('Enter end time (HH:MM AM/PM):');
                var friend = prompt('Which friend is this event for (CJ, Kelsey, Jenn)?');

                if (startTime && endTime && friend) {
                    var startDateTimeStr = info.dateStr + ' ' + startTime;
                    var endDateTimeStr = info.dateStr + ' ' + endTime;

                    var startDateTime = parseDateTime(startDateTimeStr);
                    var endDateTime = parseDateTime(endDateTimeStr);

                    if (!startDateTime || !endDateTime) {
                        alert('Invalid time format. Please enter time as HH:MM AM/PM.');
                        return;
                    }

                    var eventClass = getEventClass(friend);

                    console.log('Adding event:', title, startDateTime, endDateTime, eventClass);

                    calendar.addEvent({
                        title: `${title} (${friend})`,
                        start: startDateTime,
                        end: endDateTime,
                        classNames: [eventClass],
                        extendedProps: {
                            friend: friend
                        }
                    });

                    calendar.render();  // Ensure the calendar re-renders
                }
            }
        },
        eventClick: function(info) {
            var deleteEvent = confirm(`Event: ${info.event.title}\nStart: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end ? info.event.end.toLocaleString() : 'N/A'}\n\nDo you want to delete this event?`);

            if (deleteEvent) {
                info.event.remove();
            }
        }
    });

    calendar.render();
});

/**
 * Convert 12-hour format time to 24-hour format.
 * @param {string} time - Time in 12-hour format (HH:MM AM/PM).
 * @returns {string} - Time in 24-hour format (HH:MM).
 */
function convertTo24HourFormat(time) {
    if (!time) return '00:00';

    var [timePart, modifier] = time.split(' ');
    var [hours, minutes] = timePart.split(':');

    if (hours === '12') {
        hours = '00';
    }
    if (modifier && modifier.toLowerCase() === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Parse date and time string to a Date object.
 * @param {string} dateTimeStr - Date and time string in 'YYYY-MM-DD HH:MM AM/PM' format.
 * @returns {Date} - Parsed Date object or null if invalid.
 */
function parseDateTime(dateTimeStr) {
    var [datePart, timePart, modifier] = dateTimeStr.split(' ');
    if (!timePart || !modifier) return null;

    var [hours, minutes] = timePart.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier.toLowerCase() === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }

    var time24 = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    return new Date(`${datePart}T${time24}`);
}

/**
 * Get the CSS class for the event based on the friend.
 * @param {string} friend - The name of the friend.
 * @returns {string} - The CSS class for the event.
 */
function getEventClass(friend) {
    switch (friend.toLowerCase()) {
        case 'cj':
            return 'event-cj';
        case 'kelsey':
            return 'event-kelsey';
        case 'jenn':
            return 'event-jenn';
        default:
            return '';
    }
}
