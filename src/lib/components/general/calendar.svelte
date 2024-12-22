<script lang="ts">
  // Import necessary dependencies
  import { browser } from '$app/environment'; // For checking if code is running in browser
  import { Calendar } from '@fullcalendar/core'; // FullCalendar main component
  import dayGridPlugin from '@fullcalendar/daygrid'; // For month/week grid view
  import timeGridPlugin from '@fullcalendar/timegrid'; // For detailed time grid view
  import listPlugin from '@fullcalendar/list'; // Import the list plugin
  import type { Database } from '$lib/database.types';

  interface Props {
    reservations: Database['public']['Tables']['reservations_tb']['Row'][];
  }

  let { reservations }: Props = $props();

  // Calendar instance and DOM element references
  let calendar: Calendar;
  let calendarEl: HTMLElement;

  // Generate consistent pastel colors based on subject ID
  const generatePastelColor = (seed: string) => {
    // Hash the input string to generate a consistent number
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to HSL color (pastel)
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Transform reservations into FullCalendar events
  const transformReservationsToEvents = (reservations: Props['reservations']) =>
    reservations.map((reservation) => ({
      id: reservation.id.toString(),
      title: reservation.event_name,
      start: `${reservation.date}T${reservation.initial_time}`,
      end: `${reservation.date}T${reservation.final_time}`,
      backgroundColor: generatePastelColor(reservation.event_name),
      borderColor: generatePastelColor(reservation.event_name),
      extendedProps: {
        message: reservation.message,
        status: reservation.status,
        number_of_guest: reservation.number_of_guest,
        price: reservation.price
      }
    }));

  // Initialize and configure the FullCalendar instance
  const renderCalendar = () => {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialDate: new Date(),
      nowIndicator: true,
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      height: 'auto',
      allDayText: '',
      slotDuration: '00:15:00',
      slotLabelInterval: '00:15:00',
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short',
        hour12: true
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      },
      events: transformReservationsToEvents(reservations),
      // Custom event rendering for conflicting events
      eventDidMount: (info) => {
        if (info.event.extendedProps.status === 'conflict') {
          info.el.style.border = '2px solid red';
        }
        const tooltip = document.createElement('div');
        tooltip.innerHTML = `
          <strong>${info.event.title}</strong><br>
          Status: ${info.event.extendedProps.status}<br>
          Guests: ${info.event.extendedProps.number_of_guest}<br>
          Message: ${info.event.extendedProps.message}<br>
          Price: ${info.event.extendedProps.price}`;
        tooltip.classList.add('tooltip');
        info.el.appendChild(tooltip);
      }
    });
  };

  // Lifecycle effect to handle calendar initialization and cleanup
  $effect(() => {
    if (browser) {
      renderCalendar();
      calendar.render();
    }

    // Cleanup function to destroy calendar when component unmounts
    return () => {
      calendar.destroy();
    };
  });
</script>

<div bind:this={calendarEl}></div>

<style>
  :global(.fc) {
    --fc-border-color: hsl(var(--border));
    --fc-button-text-color: hsl(var(--foreground));
    --fc-button-bg-color: hsl(var(--background));
    --fc-button-border-color: hsl(var(--border));
    --fc-button-hover-bg-color: hsl(var(--accent));
    --fc-button-hover-border-color: hsl(var(--border));
    --fc-button-active-bg-color: hsl(var(--accent));
    --fc-button-active-border-color: hsl(var(--border));
    --fc-today-bg-color: hsl(var(--accent) / 0.5);
    --fc-neutral-bg-color: hsl(var(--background));
    --fc-list-event-hover-bg-color: hsl(var(--accent));
    --fc-page-bg-color: hsl(var(--background));
  }
</style>
