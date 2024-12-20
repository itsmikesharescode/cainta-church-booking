<script lang="ts">
  // Import necessary dependencies
  import { browser } from '$app/environment'; // For checking if code is running in browser
  import { convertTo24Hour, findConflicts } from '$lib'; // Utility functions
  import { Calendar } from '@fullcalendar/core'; // FullCalendar main component
  import dayGridPlugin from '@fullcalendar/daygrid'; // For month/week grid view
  import timeGridPlugin from '@fullcalendar/timegrid'; // For detailed time grid view

  interface Props {
    subjects: any[];
  }

  let { subjects }: Props = $props();

  // Calendar instance and DOM element references
  let calendar: Calendar;
  let calendarEl: HTMLElement;

  // Function to transform subject schedules into FullCalendar event format
  const transformSchedulesToEvents = (subjects: any[]) => {
    const events = [];
    // Map days to their corresponding numeric values (0-6)
    const daysMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    // Create a Set of subjects that have scheduling conflicts
    const conflictingSubjects = new Set(
      conflicts.flatMap((conflict) => [conflict.subject1, conflict.subject2])
    );

    // Iterate through each subject and its schedules
    for (const subject of subjects) {
      for (const schedule of subject.schedules) {
        // Calculate the next occurrence of the scheduled day
        const date = new Date();
        const targetDay = daysMap[schedule.day];
        const currentDay = date.getDay();
        date.setDate(date.getDate() + ((targetDay + 7 - currentDay) % 7));

        // Check if this subject has any conflicts
        const isConflicting = conflictingSubjects.has(subject.name);

        // Create event object with styling based on conflict status
        events.push({
          title: subject.name,
          startTime: convertTo24Hour(schedule.startTime),
          endTime: convertTo24Hour(schedule.endTime),
          daysOfWeek: [targetDay],
          // Apply different styling for conflicting events
          backgroundColor: isConflicting ? '#FFE5E5' : generatePastelColor(subject.id),
          borderColor: isConflicting ? '#FF0000' : generatePastelColor(subject.id),
          textColor: isConflicting ? '#FF0000' : '#000000',
          extendedProps: {
            department: subject.name.split('-')[0].trim(),
            isConflicting
          }
        });
      }
    }
    return events;
  };

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

  // Initialize and configure the FullCalendar instance
  const renderCalendar = () => {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      initialDate: new Date(),
      nowIndicator: true,
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      events: transformSchedulesToEvents(subjects || []),
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
      // Custom event rendering for conflicting events
      eventDidMount: (info) => {
        if (info.event.extendedProps.isConflicting) {
          const element = info.el;
          element.style.border = '2px solid red';
        }
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

  // Reactive declaration to compute schedule conflicts
  const conflicts = $derived(findConflicts(subjects || []));
</script>

<!-- Display conflict warnings if any conflicts exist -->
{#if conflicts.length > 0}
  <div class="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
    <h3 class="mb-2 text-sm font-semibold text-red-800">Schedule Conflicts Detected:</h3>
    <ul class="list-disc pl-5">
      {#each conflicts as conflict}
        <li class="text-sm text-red-700">
          Conflict between "{conflict.subject1}" and "{conflict.subject2}" on {conflict.day} at {conflict.time}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<!-- Calendar container element -->
<div bind:this={calendarEl} class="mt-4"></div>
